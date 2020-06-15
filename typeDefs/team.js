const { gql } = require('apollo-server-express');

module.exports = gql`
	# scalar type to support correct DateTime formatting
	scalar DateTime

	# custom type for the team model
	type Team {
		_id: ID!
		name: String!
        description: String
		users: [User!]! # Need to rely it with user typeDef later
		admin: User!
		createdAt: DateTime
		updatedAt: DateTime
	}

    # custom type to get team data
    type CreateTeamResponse {
        admin: User!
        description: String
        name: User!
    }
    # custom input type for updating team infos
    input UpdateTeamInput {
        name: String
        description: String
		users: [User]
		admin: User! # User will no be able to update this field
    }

    # mutation type for creating/updating a team
    type Mutation {
        createTeam: CreateTeamResponse!
        updateTeam(input: UpdateTeamInput): Team! # Return a team
    }
`;
