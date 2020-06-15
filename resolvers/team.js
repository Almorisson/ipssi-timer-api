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
		if (args.input.content.trim() === '') throw new Error('Les champs obligatoires sont requises!');

		if (currentUser) {
			// Grad the right user from db
			const userFromDb = await User.findOne({ email: currentUser.email });
			// create a new team
			let newTeam = new Team({
				name: args.input.name,
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
 * Exports all queries and mutations
 */
module.exports = {
	DateTime: DateTimeResolver,
	Query: {},

	Mutation: {
		createTeam
	}
};
