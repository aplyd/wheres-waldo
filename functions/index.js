const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

//add timestamps
exports.addTimestamp = functions.https.onCall((data, context) => {
	const uid = context.auth.uid;
	const timestamp = Date.now();

	try {
		return admin
			.firestore()
			.collection('users')
			.doc(uid)
			.update({
				[data.timeslot]: timestamp,
			})
			.catch((err) => console.log(err));
	} catch (err) {
		console.log(err);
		throw new functions.https.HttpsError();
	}
});

// create user on auth
exports.createUser = functions.auth.user().onCreate((user) => {
	return admin
		.firestore()
		.collection('users')
		.doc(user.uid)
		.set(
			{
				uid: user.uid,
				imageOne: { start: null, finish: null },
				imageTwo: { start: null, finish: null },
				imageThree: { start: null, finish: null },
			},
			{ merge: true }
		)
		.catch((err) => {
			console.log(err);
		});
});

// listens for image.finish to be updated
exports.listenForImageFinish = functions.firestore
	.document('users/{uid}/{image}/finish')
	.onUpdate((change, context) => {
		const finishTime = change.after.data();
		console.log({ finishTime });
		console.log(context.uid.image);
	});
