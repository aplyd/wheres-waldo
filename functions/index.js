const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!');
});

// exports.confirmUserCreation = functions.auth.user().onCreate((user) => {
// 	response.send('working');
// });

// create user on auth user creation
// module.exports = functions.auth.user().onCreate(() => {
// 	console.log('working');
// 	return null;
// });

// test
// module.exports = functions.https.onRequest((request, response) => {
// 	const number = Math.floor(Math.random() * 100);
// 	response.send(number.toString());
// });
