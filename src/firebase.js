import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
	apiKey: 'AIzaSyD-ynY5sO9zSc6jgcwzA-e3LW23JdYaCYM',
	authDomain: 'wheres-waldo-game.firebaseapp.com',
	databaseURL: 'https://wheres-waldo-game.firebaseio.com',
	projectId: 'wheres-waldo-game',
	storageBucket: 'wheres-waldo-game.appspot.com',
	messagingSenderId: '2081253193',
	appId: '1:2081253193:web:f58eedc6fc8ccb06a9dc98',
	measurementId: 'G-RYMKPRXCV4',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
