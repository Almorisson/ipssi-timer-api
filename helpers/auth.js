var admin = require('firebase-admin');

var serviceAccount = require('../config/firebaseAuthServiceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
	//databaseURL: "https://ipssi-project-timer-manager.firebaseio.com"
});

// helper method to check validity of a sended token by our client
exports.authCheck = async (req) => {
	// check token validity
	try {
		if (req.headers.authtoken) {
			const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
			console.log('CURRENT USER: ', currentUser);
			return currentUser;
		} else {
            console.log("Aucun token n'a été envoyé par le client.")
		}
	} catch (error) {
		console.log(`Le token soumis est invalide ou a expiré. ${error.message}`);
	}
};
