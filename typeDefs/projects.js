const { gql } = require('apollo-server-express');

module.exports = gql`
	# scalar type to support correct DateTime formatting
	scalar DateTime

    type Timer {
        name: String
        description: String
        loggedTime: DateTime!
        project: Project
    }
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

    # custom input type for updating project infos
    input UpdateProjectInput {
        name: String
        description: String
		#tasks: [Timer!]!
		#admin: User! # We will no able user to update this field
    }

    # mutation type for creating/updating a project
    type Mutation {
        createProject: Project!
        updateProject(input: UpdateProjectInput): Project! # Return a project
    }
`;
