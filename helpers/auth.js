var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseAuthServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://ipssi-project-timer-manager.firebaseio.com"
});


// helper method to check validity of a sended token by our client
exports.authCheck = (req, res, next = (f) => f) => {
    if(!req.headers.authtoken) throw new Error("Vous n'êtes pas autorisé à accéder à cette resource!")

    // check token validity
    const valid = req.headers.authtoken === "secret" // Next will come from firebase

	if (valid) {
		next();
	} else {
		throw new Error("Vous n'êtes pas autorisé à accéder à cette resource!");
	}
};
