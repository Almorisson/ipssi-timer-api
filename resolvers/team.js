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
				...args.input,
				admin: userFromDb._id,
				users: [ userFromDb ]
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
 * Exports all queries and mutations
 */
module.exports = {
	DateTime: DateTimeResolver,
	Query: {
		teamsCreatedByAdmin
	},

	Mutation: {
		createTeam
	}
};
