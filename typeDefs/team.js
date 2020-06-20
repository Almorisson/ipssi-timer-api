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

	# custom input type for user model
	input UserInput {
        _id: String
		email: String
		username: String
		name: String
	}

	# custom type to get team data
	input CreateTeamInput {
		name: String!
		description: String
        users: [UserInput]
	}

	# custom input type for updating team infos
	input UpdateTeamInput {
		_id: String!
		name: String
		description: String
		users: [UserInput]
	}

	# mutation type for creating/updating/deleting a team
	type Mutation {
		createTeam(input: CreateTeamInput!): Team! # Return a team
		updateTeam(input: UpdateTeamInput): Team! # Return a team
		deleteTeam(teamId: String!): Team! # Return a team
	}

	# query type to retrieve given team(s)
	type Query {
		teamsCreatedByAdmin: [Team!]! # Return a collection of teams belongs to a user(admin of this one)
		singleTeam(teamId: String!): Team! # Return a team
	}
`;
