const { gql } = require('apollo-server-express');

module.exports = gql`
    # scalar type
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
        images: [ImageInput]
        bio: String
    }
    # built-in type
    type Query {
		profile: User!  # Return a User
	}

    # custom mutation type for creating/updating a user
    type Mutation {
        createUser: CreateUserResponse!
        updateUser(input: UpdateUserInput): User!
    }

`;
