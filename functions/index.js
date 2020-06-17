const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!');
});

exports.createUser = functions.auth.user().onCreate((user) => {
	console.log('creating user doc on auth');
	return admin
		.firestore()
		.collection('users')
		.doc(user.uid)
		.set({
			uid: user.uid,
			imageOne: { start: null, finish: null },
			imageTwo: { start: null, finish: null },
			imageThree: { start: null, finish: null },
		});
});

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
