const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		me: String!

	}
    # custom type to get user data
    type CreateUserResponse {
        username: String!
        email: String!
    }
    # custom mutation type for creating a user
    type Mutation {
        createUser: CreateUserResponse!
    }
`;
