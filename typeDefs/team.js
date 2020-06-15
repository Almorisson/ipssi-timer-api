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

	# custom input type of type user
	input UserInput {
		email: String
		username: String
		name: String
		bio: String
	}

	# custom type to get team data
	input CreateTeamInput {
		name: String!
		description: String
	}

	# custom input type for updating team infos
	input UpdateTeamInput {
		name: String
		description: String
		users: [UserInput]
		admin: UserInput! # User will no be able to update this field
	}

	# mutation type for creating/updating a team
	type Mutation {
		createTeam(input: CreateTeamInput!): Team!
		updateTeam(input: UpdateTeamInput): Team! # Return a team
	}

	# query type to retrieve given team(s)
	type Query {
		teamsCreatedByAdmin: [Team!]!
	}
`;
