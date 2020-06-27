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
		.doc(uid)
		.set(
			{
				[data.image]: {
					start: timestamp,
				},
			},
			{ merge: true }
		)
		.catch((err) => {
			console.log(err);
			throw new functions.https.HttpsError();
		});
});

exports.addFinishTimestampAndCalculateTotal = functions.https.onCall(
	(data, context) => {
		const uid = context.auth.uid;

		// get start time from firestore
		return admin
			.firestore()
			.collection('scores')
			.doc(uid)
			.get()
			.then((res) => {
				// calculate the difference between start and current timestamp
				const userData = res.data();
				const totalTimeInMillis =
					Date.now() - userData[data.image].start;

				//save total time in firestore in a readable format (minutes and seconds)
				return admin
					.firestore()
					.collection('scores')
					.doc('all')
					.update(
						{
							[uid]: {
								[data.image]: totalTimeInMillis,
								uid,
								name: '',
							},
						},
						{ merge: true }
					)
					.then(() => {
						// return time to client
						return {
							totalTimeInMillis,
						};
					});
			})
			.catch((err) => {
				console.log(err);
				throw new functions.https.HttpsError();
			});
	}
);

// Create user document on user authentication.
exports.createUser = functions.auth.user().onCreate((user) => {
	return admin
		.firestore()
		.collection('scores')
		.doc(user.uid)
		.set(
			{
				imageOne: { start: null, total: null },
				imageTwo: { start: null, total: null },
				imageThree: { start: null, total: null },
				name: '',
				uid: user.uid,
			},
			{ merge: true }
		)
		.catch((err) => {
			console.log(err);
			throw new functions.https.HttpsError();
		});
});
