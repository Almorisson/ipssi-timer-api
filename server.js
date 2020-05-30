const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { mergeTypes, mergeResolvers, fileLoader } = require('merge-graphql-schemas');
const { authCheckMiddleware } = require('./helpers/auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const cloudinary = require('cloudinary');
require('dotenv').config();

const app = express();


// typeDefs : query | mutation | subscription
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')));

//resolvers
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// Apollo server
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res })
});

// applyMiddleware method to connect ApolloServer to a specific HTTP framework ie: express
apolloServer.applyMiddleware({ app });

// apply middleware for the Rest server
app.use(cors());
app.use(
	bodyParser.json({
		limit: '5mb'
	})
);

// rest endpoint for testing
app.get('/test', authCheckMiddleware, (req, res, next) => {
	next();
	res.json({
		data: 'IPSSI Timer Manager'
	});
});

// cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload images to cloudinary
app.post('/profile/upload-image', authCheckMiddleware, (req, res) => {
	cloudinary.uploader.upload(req.body.profileImage, (img) => {
        console.log("Image to Upload: ", img)
		return res.send({
			url: img.secure_url,
			public_id: img.public_id
		});
	}),
		{
			public_id: `${Date.now()}`, // public image name
			resource_type: 'auto' // guess the image type extension (JPEG, PNG, etc)
		};
});

// delete image from cloudinary
app.post('/profile/delete-image', authCheckMiddleware, (req, res) => {
	let image_id = req.body.public_id;
	cloudinary.uploader.destroy(image_id, (error, response) => {
		if(error) return res.send({ success: false, error})
        return res.send({ message: response});
	})
});

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
