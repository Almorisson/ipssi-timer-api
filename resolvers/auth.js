const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const shortid = require('shortid');
const { DateTimeResolver } = require('graphql-scalars');
const user = require('../models/user');
/**
 * Allow to get profile infos of a given User
 *  @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const profile = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
			return await User.findOne({ email: currentUser.email }).exec();
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 * Allow to get public profile of a given user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const publicProfile = async (_, args) => await User.findOne({ username: args.username }).exec();
/**
 * Allow to get all users
 * @param {*} _
 * @param {*} args
 */
const allUsers = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
            const filteredUsers = await User.find({ email: { $ne: currentUser.email}}).sort({ createdAt: -1});
            return filteredUsers;
		}
	} catch (error) {
		console.log(error);
	}
};

/**
 * Log in an existing user or create it if not exist
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const createUser = async (_, args, { req }) => {
	try {
		const currentUser = await authCheck(req);
		if (currentUser) {
			const user = await User.findOne({ email: currentUser.email });

			return user
				? user
				: new User({
						email: currentUser.email,
						username: shortid.generate()
					})
						.save()
						.then((user) => user)
						.catch((error) => console.log(error));
		}
	} catch (error) {
		console.log(error.message);
	}
};
/**
 * Allow user to update its infos
 * @see authCheck method to better understand how we verified that user is current logged in user
 *
 * @param {*} _
 * @param {*} args
 * @param {*} param2
 */
const updateUser = async (_, args, { req }) => {
	/* const currentUser = await authCheck(req);
    const updatedUser = await User.findOneAndUpdate(
				{ email: currentUser.email },
				{ ...args.input },
				{ new: true }
			).exec();

			return updatedUser; */
	try {
		const currentUser = await authCheck(req);
		if (currentUser !== null) {
			const updatedUser = await User.findOneAndUpdate(
				{ email: currentUser.email },
				{ ...args.input },
				{ new: true }
			).exec();

			return updatedUser;
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
	Query: {
		profile,
		publicProfile,
		allUsers
	},

	Mutation: {
		createUser,
		updateUser
	}
};
