const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');
const Team = require('../models/team');
const Project = require('../models/project');
const User = require('../models/user');
const { DateTimeResolver } = require('graphql-scalars');

/**
 * Create a new project
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const createProject = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);

		// validation
		if (args.input.name.trim() === '')
			return res.json({
				errorMessage: 'Le champ nom est obligatoire pour crÃ©er un nouveau projet!'
			});

		if (currentUser) {
			const project = await Project.findOne({ name: args.input.name }).exec();
			if (project)
				return res.json({
					errorMessage: 'Le nom de ce projet existe dÃ¨jÃ , veuillez choisir un autre nom !'
				});
			// Grad the right user from db
			const userFromDb = await User.findOne({ email: currentUser.email }).exec();
			// create a new project
			let newProject = new Project({
				...args.input,
				createdBy: userFromDb._id
			})
				.save()
				.then((project) => project.execPopulate('createdBy', '_id username name'));

			return newProject;
		}
	} catch (error) {
		console.log(error.message);
	}
};

/**
 * Allow user to update a project when he is the creator of this one
 * @see authCheck method to better understand how we verified that user is current logged in user
 * @todo : To improve later to better match with requirements
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const updateProject = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	// validation
	if (args.input.name.trim() === '' && args.input.description.trim() === '')
		return res.json({
			errorMessage: 'Vous devez renseigner au moins un des champs pour mettre à jour cette le projet'
		});
	//  get current user mongodb _id based in email
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	// _id of team to update
	const projectToUpdate = await Project.findById({ _id: args.input._id }).exec();
	// Allow update if current user id and id of the team's admin are same,
	if (currentUserFromDb._id.toString() !== projectToUpdate.createdBy._id.toString())
		return res.json({
			errorMessage: "Vous n'avez les droits nécessaires pour effectuer cette action."
		});
	let updatedProject = await Project.findByIdAndUpdate(args.input._id, { ...args.input }, { new: true })
		.exec()
		.then((project) => project.populate('createdBy', '_id username name').execPopulate());

	return updatedProject;
};

/**
 * Allow to delete a team when user is admin of this one
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const deleteProject = async (_, args, { req, res }) => {
	const currentUser = await authCheck(req);
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	const projectToDelete = await Project.findById({ _id: args.projectId }).exec();
	// validation
	if (!projectToDelete) return res.json({ errorMessage: "Ce projet n'exisste pas dans la base de données." });
	if (currentUserFromDb._id.toString() !== projectToDelete.createdBy._id.toString())
		return res.json({
			errorMessage: "Vous n'avez les droits nécessaires pour effectuer cette action."
		});
	let deletedProject = await Project.findByIdAndDelete({ _id: args.projectId })
		.exec()
		.then((project) => project.populate('createdBy', '_id username name').execPopulate());

	return deletedProject;
};

/**
 * Get all projects created by a given user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const projectsCreatedByUser = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
			// Grad the right user from db
			const userFromDb = await User.findOne({ email: currentUser.email }).exec();

			return await Project.find({ createdBy: userFromDb })
				.populate('createdBy', '_id username name')
				.sort({ createdAt: -1 });
		}
	} catch (error) {
		console.log(error);
	}
};
/**
 * Get a single project infos created by a given user
 *
 * @param {*} parent
 * @param {*} args
 */
const singleProject = async (_, args) => {
	return await Project.findById({ _id: args.projectId }).populate('createdBy', '_id username name').exec();
};

/**
 * Exports all queries and mutations
 */
module.exports = {
	DateTime: DateTimeResolver,
	Query: {
		projectsCreatedByUser,
		singleProject
	},

	Mutation: {
		createProject,
		updateProject,
		deleteProject
	}
};
