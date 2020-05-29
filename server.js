const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { mergeTypes, mergeResolvers, fileLoader } = require('merge-graphql-schemas');
const { authCheck } = require('./helpers/auth');

require('dotenv').config();

const app = express();

// rest endpoint for testing

app.get('/', authCheck, (req, res, next) => {
	next();
	res.json({
		data: 'IPSSI Timer Manager'
	});
});

// typeDefs : query | mutation | subscription
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));

//resolvers
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// Apollo server
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({req, res})
});

// applyMiddleware method to connect ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app });

// server : Note probably needed later
const httpServer = http.createServer(app);

const db = async () => {
	try {
		await mongoose.connect(process.env.MONGO_ATLAS_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false // To Suppress deprecated warning messages
		});
		console.log('DB connected');
	} catch (error) {
		console.log(`Connection Error : ${error}`);
	}
};

// Execute DB connections
db();

app.listen(process.env.PORT, () => {
	console.log(`Server is listening on http://localhost:${process.env.PORT}`);
	console.log(`Server is listening on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
});
