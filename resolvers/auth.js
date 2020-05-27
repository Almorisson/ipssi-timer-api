const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');

const me = async(_, args, { req }) => {
	await authCheck(req);
	return 'Mountakha NDIAYE';
};

module.exports = {
	Query: {
		me
	}
};
