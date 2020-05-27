var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseAuthServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://ipssi-project-timer-manager.firebaseio.com"
});


// helper method to check validity of a sended token by our client
exports.authCheck = async (req) => {
    if(!req.headers.authtoken) throw new Error("Vous n'êtes pas autorisé à accéder à cette resource!")

    // check token validity
   try {
        const result = await admin.auth().verifyIdToken(req.headers.authtoken);
        console.log("Result info", result);
        return result;
   } catch (error) {
       throw new Error("Le token soumis est invalide ou a expiré.");
   }
};
