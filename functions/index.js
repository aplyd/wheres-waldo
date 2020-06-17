const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
// 	response.send('Hello from Firebase!');
// });

exports.addTimestamp = functions.https.onCall((data, context) => {
	const uid = context.auth.uid;

	const timestamp = Date.now();
	//need to pass whether we're updating start or finish
	if (data.where === 'start') {
		const obj = { start: timestamp };
	}

	return (
		admin
			.firestore()
			.collection('users')
			.doc(uid)
			//need to pass current image
			.update({})
	);
});

//create user on auth
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
