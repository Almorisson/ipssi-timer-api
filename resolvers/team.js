const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');
const Team = require('../models/team');
const User = require('../models/user');
const { DateTimeResolver } = require('graphql-scalars');

/**
 * Create a new team
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const createTeam = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);

		// validation
		if (args.input.name.trim() === '')
			throw new Error('Les champ nom est obligatoire pour créer un nouveau groupe!');
		const team = await Team.findOne({ name: args.input.name }).exec();

		if (currentUser) {
			if (team) throw new Error('Ce nom de ce groupe existe dèjà, veuillez choisir un autre nom');
			// Grad the right user from db
			const userFromDb = await User.findOne({ email: currentUser.email }).exec();
			// create a new team
			let newTeam = new Team({
                name: args.input.name,
                description: args.input.description,
				users: [ userFromDb, ...args.input.users ],
				admin: userFromDb._id,
			})
				.save()
				.then((team) => team.execPopulate('admin', '_id username name'));

			return newTeam;
		}
	} catch (error) {
		console.log(error.message);
	}
};
/**
 * Allow to update a team when user is admin of this one
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const updateTeam = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	// validation
	if (args.input.name.trim() === '' && args.input.description.trim() === '' && args.input.users.length === 0)
		throw new Error('Vous devez renseigner au moins un des champs pour meettre à jour cette équipe');
	//  get current user mongodb _id based in email
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	// _id of team to update
	const teamToUpdate = await Team.findById({ _id: args.input._id }).exec();
	// Allow update if current user id and id of the team's admin are same,
	if (currentUserFromDb._id.toString() !== teamToUpdate.admin._id.toString())
		throw new Error("Vous n'avez les droits nécessaires pour effectuer cette action.");
	let updatedTeam = await Team.findByIdAndUpdate(args.input._id, { ...args.input }, { new: true })
		.exec()
		.then((team) => team.populate('admin', '_id username name').execPopulate());

	return updatedTeam;
};
/**
 * Allow to delete a team when user is admin of this one
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const deleteTeam = async (_, args, { req }) => {
	const currentUser = await authCheck(req);
	const currentUserFromDb = await User.findOne({ email: currentUser.email }).exec();
	const teamToDelete = await Team.findById({ _id: args.teamId }).exec();
	if (currentUserFromDb._id.toString() !== teamToDelete.admin._id.toString()) throw new Error('Unauthorized action');
	let deletedTeam = await Team.findByIdAndDelete({ _id: args.teamId })
		.exec()
		.then((team) => team.populate('admin', '_id username name').execPopulate());

	return deletedTeam;
};

/**
 * Get all teams created by a given user(the admin of this team)
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const teamsCreatedByAdmin = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
			// Grad the right user from db
			const userFromDb = await User.findOne({ email: currentUser.email }).exec();

			return await Team.find({ admin: userFromDb })
				.populate('admin', '_id username name')
				.sort({ createdAt: -1 });
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 * Get a single team infos
 *
 * @param {*} parent
 * @param {*} args
 */
const singleTeam = async (_, args) => {
	return await Team.findById({ _id: args.teamId }).populate('admin', '_id username name').exec();
};

/**
 * Exports all queries and mutations
 */
module.exports = {
	DateTime: DateTimeResolver,
	Query: {
		teamsCreatedByAdmin,
		singleTeam
	},

	Mutation: {
		createTeam,
		updateTeam,
		deleteTeam
	}
};
