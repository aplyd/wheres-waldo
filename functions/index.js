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
		const calculateTimeDifference = (newerTime, olderTime) => {
			const difference = newerTime - olderTime;
			const minutes = Math.floor(difference / 60000);
			const seconds = ((difference % 60000) / 1000).toFixed(0);
			return seconds === 60
				? minutes + 1 + ':00'
				: minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
		};

		// get start time from firestore
		return admin
			.firestore()
			.collection('scores')
			.doc(uid)
			.get()
			.then((res) => {
				// calculate the difference between start and current timestamp
				const userData = res.data();
				const totalReadableTime = calculateTimeDifference(
					Date.now(),
					userData[data.image].start
				);

				//save total time in firestore in a readable format (minutes and seconds)
				return admin
					.firestore()
					.collection('scores')
					.doc('all')
					.update(
						{
							[uid]: {
								[data.image]: totalReadableTime,
								uid,
								name: '',
							},
						},
						{ merge: true }
					)
					.then(() => {
						// return time to client
						return {
							totalReadableTime,
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
