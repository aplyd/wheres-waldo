const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// add timestamps
exports.addStartTimestamp = functions.https.onCall((data, context) => {
	const uid = context.auth.uid;
	const timestamp = Date.now();

	// if the username hasn't already been set, do so
	// then store the start timestamp
	if (data.name !== '' && !data.hasNameBeenSet) {
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
			.then(() => {
				return admin
					.firestore()
					.collection('scores')
					.doc('all')
					.set(
						{
							[uid]: {
								name: data.name,
							},
						},
						{ merge: true }
					);
			})
			.catch((err) => {
				console.log(err);
				throw new functions.https.HttpsError();
			});
		// if username has been set, just store the start timestamp
	} else {
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
	}
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

				// save total time in firestore in a readable format (minutes and seconds)
				return admin
					.firestore()
					.collection('scores')
					.doc('all')
					.set(
						{
							[uid]: {
								uid,
								[data.image]: {
									[data.userVisitId]: totalTimeInMillis,
								},
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
