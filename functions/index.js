const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log(request)
    response.send("Hello from Firebase!" +  request);
});

exports.addPagoPayU = functions.https.onRequest(async (req, res)=>{
    const original = req.query.text;
    const snapshot = await admin.database().ref('/messages').push({original: original});
    res.redirect(303, snapshot.ref.toString());
});