const { gql } = require('apollo-server-express');

module.exports = gql`
    # scalar type to support correct DateTime formatting
    scalar DateTime

     # custom type an given Image
    type Image {
        url: String
        public_id: String
    }
    # custom type for a user graphql model
    type User {
        _id: ID!
        email: String
        username: String
        name: String
        images: [Image]
        bio: String
        createdAt: DateTime
        updatedAt: DateTime
    }

    # custom type to get user data
    type CreateUserResponse {
        username: String!
        email: String!
    }
    # custom input type for user profile images
    input ImageInput {
        url: String
        public_id: String
    }
    # custom input type for updating user infos
    input UpdateUserInput {
        username: String
        name: String
        email: String! # We will no able user to update this field
        images: [ImageInput]
        bio: String
    }
    # query type to get get user infos
    type Query {
		profile: User!  # Return a User
	}

    # mutation type for creating/updating a user
    type Mutation {
        createUser: CreateUserResponse!
        updateUser(input: UpdateUserInput): User!
    }

`;
