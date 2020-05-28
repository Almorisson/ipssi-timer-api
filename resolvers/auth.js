const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const shortid = require('shortid');

const me = async (_, args, { req }) => {
	await authCheck(req);
	return 'Mountakha NDIAYE';
};

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

module.exports = {
	Query: {
		me
	},

	Mutation: {
		createUser
	}
};
