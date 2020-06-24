const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { AiFillCaretRight } = require('react-icons/ai');

admin.initializeApp();

//add timestamps
exports.addTimestamp = functions.https.onCall((data, context) => {
	const uid = context.auth.uid;
	const timestamp = Date.now();

	const updated = { [data.timeslot]: timestamp };

	if (data.timeslot === 'finish') {
		//todo - fetch start time

		const calculatedTime = 'calculate here';
		updated.total = calculatedTime;
	}

	try {
		return admin
			.firestore()
			.collection('users')
			.doc(uid)
			.update(updated)
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

// listens for image.finish to be updated - commented out because probably maybe not needed
// exports.listenForImageFinish = functions.firestore
// 	.document('users/{uid}')
// 	.onUpdate((change, context) => {
// 		const after = change.after.data();
// 		const before = change.before.data();

// 		if (after.imageOne.finish !== before.imageOne.finish) {
// 			conosle.log('finish image one')
// 		}

// 		if (after.imageTwo.finish !== before.imageTwo.finish) {
// 			console.log('finish image two')
// 		}

// 		if (after.imageThree.finish !== before.imageThree.finish) {
// 			console.log('finish image three')
// 		}

// 		console.log({ finishTime });

// 		return null;
// 	});
