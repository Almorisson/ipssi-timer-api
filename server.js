const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

const db = async () => {
	try {
		mongoose
			.connect(process.env.MONGO_ATLAS_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: true // To Suppress deprecated warning messages
			})
			.then(() => console.log('DB connected'));
	} catch (error) {
		console.log(`Connection Error : ${error}`);
	}
};

// Execute DB connection
db();

app.listen(process.env.PORT, () => {
	console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
