const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');
const Team = require('../models/team');
const Project = require('../models/project');
const User = require('../models/user');
const Timer = require('../models/timer');

const { DateTimeResolver } = require('graphql-scalars');

/**
 * Create a new timer
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const createTimer = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);

		// validation
		if (args.input.title.trim() === '')
			return res.json({
				errorMessage: 'Le champ titre est obligatoire pour crÃƒÂ©er une nouvelle tÃ¢che !'
			});

		if (currentUser) {
			const project = await Project.findOne({ _id: args.projectId }).exec();

			// update project tasks field first
			await Project.findOneAndUpdate({ _id: args.projectId }, { tasks: { ...args.input } }, { new: true }).exec();

			// create a new project
			let newTimer = new Timer({
				...args.input,
				project: project._id
			})
				.save()
				.then((timer) => timer.execPopulate('project', '_id name description'));

			return newTimer;
		}
	} catch (error) {
		console.log(error.message);
	}
};

/**
 * Get all timers per project created by a given user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const allTimersPerProject = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
			const currentProject = await Project.findById({ _id: args.projectId }).exec();
			if (currentProject) return await Timer.find({}).sort({ createdAt: -1 }).exec();
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 * Allow user to update a timer when he is the creator of this one
 * @see authCheck method to better understand how we verified that user is current logged in user
 * @todo : To improve later to better match with requirements
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const updateTimer = async (_, args, { req }) => {
    const currentUser = await authCheck(req);
	// validation
	if (args.input.name.trim() === '' && args.input.description.trim() === '')
		return res.json({
			errorMessage: 'Vous devez renseigner au moins un des champs pour mettre à jour cette la tâche'
		});
	//  get current user mongodb _id based in email
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	// _id of team to update
	const timerToUpdate = await Timer.findById({ _id: args.input._id }).exec();
	// Allow update if current user id and id of the team's admin are same,
	if (currentUserFromDb._id.toString() !== timerToUpdate.project.createdBy._id.toString())
		return res.json({
			errorMessage: "Vous n'avez les droits nécessaires pour effectuer cette action."
		});
	let updatedTimer = await Timer.findByIdAndUpdate(args.input._id, { ...args.input }, { new: true })
		.exec()
		.then((timer) => timer.populate('project', '_id name description createdBy').execPopulate());

	return updatedTimer;
};


/**
 * Allow to delete a given timer
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const deleteTimer = async (_, args, { req }) => {
    const currentUser = await authCheck(req);
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	const timerToDelete = await Timer.findById({ _id: args.timerId }).exec();
	// validation
	if (!timerToDelete) return res.json({ errorMessage: "Ce projet n'exisste pas dans la base de données." });
	if (currentUserFromDb._id.toString() !== timerToDelete.project.createdBy._id.toString())
		return res.json({
			errorMessage: "Vous n'avez les droits nécessaires pour effectuer cette action."
		});
	let deletedTimer = await Timer.findByIdAndDelete({ _id: args.timerId })
		.exec()
		.then((timer) => timer.populate('project', '_id name description createdBy').execPopulate());

	return deletedTimer;
};

/**
 * Exports all queries and mutations
 */
module.exports = {
	DateTime: DateTimeResolver,
	Query: {
		allTimersPerProject
	},

	Mutation: {
		createTimer,
		updateTimer,
		deleteTimer
	}
};
