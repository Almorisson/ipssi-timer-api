const { gql } = require('apollo-server-express');
const { authCheck } = require('../helpers/auth');

const me = (_, args, { req, res }) => {
	authCheck(req, res);
	return 'Mountakha NDIAYE';
};

module.exports = {
	Query: {
		me
	}
};
