const { gql } = require('apollo-server-express');

module.exports = gql`
	# scalar type to support correct DateTime formatting
	scalar DateTime

	type Timer {
        _id: ID!
		title: String!
		description: String!
		loggedTime: Int!
		project: Project!
        createdAt: DateTime
        updatedAt: DateTime
	}

	# custom input type for Timer
	input CreateTimerInput {
		title: String!
		description: String
		loggedTime: Int!
	}

	# custom input type for Timer
	input UpdateTimerInput {
		title: String!
		description: String
	}

	# mutation type for creating/updating a project
	type Mutation {
		createTimer(input: CreateTimerInput!, projectId: String!): Timer! # Return a timer
		updateTimer(input: UpdateTimerInput!): Timer! # Return a timer
		deleteTimer(timerId: String!): Timer! # Return a timer
	}

	# query type to retrieve given team(s)
	type Query {
        allTimersPerProject(projectId: String!): [Timer!]!
        singleTimer(timerId: String!): Timer!
    }
`;
