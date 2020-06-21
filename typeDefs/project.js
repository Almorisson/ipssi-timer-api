const { gql } = require('apollo-server-express');

module.exports = gql`
	# scalar type to support correct DateTime formatting
	scalar DateTime

	# custom type for the project model
	type Project {
		_id: ID!
		name: String!
        description: String!
		assignedTeams: [Team!]!
		tasks: [Timer!]! # Need to rely it with timer typeDef later
        createdBy: User
		createdAt: DateTime
		updatedAt: DateTime
	}

    # custom type to get project data
	input CreateProjectInput {
		name: String!
		description: String
	}

    # custom input type for Timer
    input TimerInput {
        title: String!
        description: String
        loggedTime: DateTime
    }

    # custom input type for updating project infos
    input UpdateProjectInput {
        _id: String!
        name: String
        description: String
		assignedTeams: [UpdateTeamInput!]
        tasks: [TimerInput!] #Will come later to here
    }

    # mutation type for creating/updating a project
    type Mutation {
        createProject(input: CreateProjectInput!): Project! # Return a project
        updateProject(input: UpdateProjectInput!): Project! # Return a project
        deleteProject(projectId: String!): Project! # Return a project
    }
    	# query type to retrieve given team(s)
	type Query {
		projectsCreatedByUser: [Project!]! # Return a collection of projects created by a user
		singleProject(projectId: String!): Project! # Return a project
	}
`;
