var admin = require('firebase-admin');

var serviceAccount = require('../config/firebaseAuthServiceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
	//databaseURL: "https://ipssi-project-timer-manager.firebaseio.com"
});

// helper method to check validity of a sended token by our client
exports.authCheck = async (req) => {
	// check token validity
	if (req.headers.authtoken) {
		const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
		console.log('CURRENT USER: ', currentUser);
		return currentUser;
	} else {
		console.log("Vous n'êtes pas autorisé à accéder à cette ressource !");
	}
};

exports.authCheckMiddleware = async (req, res, next) => {
	// check if user is the current logged in user
	if (req.headers.authtoken) {
		await admin
			.auth()
			.verifyIdToken(req.headers.authtoken)
			.then((result) => {
				next();
			})
			.catch((error) => console.log(error));
	} else {
		return res.send({ success: false, error: "Vous n'êtes pas autorisé à accéder à cette ressource !" });
	}
};
