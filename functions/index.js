const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

//add timestamps
exports.addStartTimestamp = functions.https.onCall((data, context) => {
	const uid = context.auth.uid;
	const timestamp = Date.now();

	return admin
		.firestore()
		.collection('scores')
		.doc('all')
		.set(
			{
				[uid]: {
					[data.image]: {
						start: timestamp,
					},
				},
			},
			{ merge: true }
		)
		.catch((err) => {
			console.log(err);
			throw new functions.https.HttpsError();
		});
});

// exports.addFinishTimestampAndCalculateTotal = functions.https.onCall(
// 	(data, context) => {
// 		const uid = context.auth.uid;
// 		const timestamp = Date.now();
//
//		// first, gets start time
// 		return admin
// 			.firestore()
// 			.collection('users')
// 			.doc(uid)
// 			.get()
// 			.then((res) => {
//				// second, calculates the difference between start and current timestamp and adds to firestore
// 				return admin
// 					.firestore()
// 					.collection('users')
// 					.doc(uid)
// 					.update({ [data.timeslot]: timestamp });
//					.then(() => {
//					// then returns returns the value
//					})
// 			});
// 	}
// );

// create user on auth
exports.createUser = functions.auth.user().onCreate((user) => {
	return admin
		.firestore()
		.collection('scores')
		.doc('all')
		.set(
			{
				[user.uid]: {
					imageOne: { start: null, total: null },
					imageTwo: { start: null, total: null },
					imageThree: { start: null, total: null },
					name: '',
					uid: user.uid,
				},
			},
			{ merge: true }
		)
		.catch((err) => {
			console.log(err);
			throw new functions.https.HttpsError();
		});
});
