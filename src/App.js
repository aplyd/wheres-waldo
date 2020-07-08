import React, { useReducer, useEffect } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Route, Switch, useHistory } from 'react-router-dom';
import imageOne from './images/imageOne.jpg';
import imageTwo from './images/imageTwo.jpg';
import imageThree from './images/imageThree.jpg';
import firebase from './firebase';

import waldoImg from './images/waldo.jpg';
import wendyImg from './images/wendy.jpg';
import wizardImg from './images/wizard.jpg';
import odlawImg from './images/odlaw.jpg';

import Image from './layouts/Image';
import Cover from './layouts/Cover';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Result from './layouts/Result';
import Scoreboard from './layouts/Scoreboard';
import * as consts from './constants';

const addStartTimestamp = firebase
	.functions()
	.httpsCallable('addStartTimestamp');

const addFinishTimestampAndCalculateTotal = firebase
	.functions()
	.httpsCallable('addFinishTimestampAndCalculateTotal');

function layoutReducer(state, action) {
	switch (action.type) {
		case consts.SAVE_UID:
			return {
				...state,
				uid: action.uid,
			};
		case consts.SAVE_USERNAME:
			return {
				...state,
				allScores: {
					...state.allScores,
					userScores: {
						...state.allScores.userScores,
						name: action.username,
					},
				},
				hasNameBeenSet: false,
			};
		case consts.SAVE_ALL_SCORES:
			return {
				...state,
				allScores: { ...state.allScores, ...action.allScores },
			};
		case consts.START_GAME:
			addStartTimestamp({
				image: state.images[state.currentImageIndex].string,
				name: state.allScores.userScores.name,
				hasNameBeenSet: state.hasNameBeenSet,
			}).catch((err) => console.log(err));
			return {
				...state,
				hasGameStarted: true,
			};

		case consts.IMAGE_RESIZE:
			return {
				...state,
				currentImageHeight: action.height,
			};

		case consts.CLICKED:
			// if the dropdown and selection are already displayed, close them
			if (state.isSelectCharacterShown) {
				return {
					...state,
					isSelectCharacterShown: false,
				};
			} else {
				// else display character dropdown
				return {
					...state,
					currentClickCoords: action.currentClickCoords,
					currentClickPercentage: action.currentClickPercentage,
					isSelectCharacterShown: true,
				};
			}

		case consts.CHARACTER_FOUND:
			const characterFoundClick = {
				x: state.currentClickPercentage.x,
				y: state.currentClickPercentage.y,
				windowScrollX: state.currentClickPercentage.windowScrollX,
				windowScrollY: state.currentClickPercentage.windowScrollY,
				characterFound: true,
			};

			const characterFoundState = {
				...state,
				clicksArray: [characterFoundClick, ...state.clicksArray],
				isSelectCharacterShown: false,
			};

			characterFoundState[state.images[state.currentImageIndex].string][
				action.character
			].found = true;

			return characterFoundState;

		case consts.CHARACTER_NOT_FOUND:
			const wrongClick = {
				x: state.currentClickPercentage.x,
				y: state.currentClickPercentage.y,
				windowScrollX: state.currentClickPercentage.windowScrollX,
				windowScrollY: state.currentClickPercentage.windowScrollY,
				characterFound: false,
			};
			const allClicks =
				state.clicksArray.length > 0
					? [wrongClick, ...state.clicksArray]
					: [wrongClick];

			return {
				...state,
				isSelectCharacterShown: false,
				clicksArray: allClicks,
			};
		case consts.TOGGLE_SELECTION_CONTAINER:
			if (action.coords) {
				return {
					selectionContainer: {
						x: action.coords.x,
						y: action.coords.y,
					},
					...state,
				};
			} else {
				return {
					selectionContainer: null,
					...state,
				};
			}
		case consts.LOADING_RESULTS:
			return {
				...state,
				clicksArray: [],
				isLoadingResult: true,
				hasResultBeenCalculated: true,
			};

		case consts.SHOW_RESULTS:
			const resultsState = { ...state };
			resultsState.isLoadingResult = false;
			resultsState.allScores.userScores[
				state.images[state.currentImageIndex].string
			][consts.USER_VISIT_ID] = action.result;

			return resultsState;

		case consts.NEXT_ROUND:
			const nextRoundState = { ...state };
			nextRoundState.currentImageIndex = state.currentImageIndex + 1;

			// add start timestamp for next round
			addStartTimestamp({
				image: state.images[nextRoundState.currentImageIndex].string,
				name: state.allScores.userScores.name,
				hasNameBeenSet: state.hasNameBeenSet,
			}).catch((err) => console.log(err));

			if (
				state.allScores.userScores.name !== '' &&
				!state.hasNameBeenSet
			) {
				nextRoundState.allScores.userScores.NameBeenSet = true;
			}

			nextRoundState.hasResultBeenCalculated = false;
			return nextRoundState;

		case consts.LOADING_FINAL_RESULTS:
			return {
				...state,
				clicksArray: [],
				isLoadingResult: true,
				hasResultBeenCalculated: true,
			};

		case consts.SHOW_FINAL_RESULTS:
			const finalResultsState = { ...state };
			finalResultsState.isLoadingResult = false;
			finalResultsState.allScores.userScores[
				state.images[state.currentImageIndex].string
			][consts.USER_VISIT_ID] = action.result;

			return finalResultsState;

		default:
			return state;
	}
}

// formula to get character position in percentage
// width% = x / imgWidth x 100
// height% = (y - 52) / imgHeight x 100

const initialLayoutState = {
	allScores: {
		userScores: {
			imageOne: {},
			imageTwo: {},
			imageThree: {},
			name: '',
		},
	},
	uid: null,
	hasNameBeenSet: false,
	isImageShown: false,
	isLoadingResult: false,
	hasGameStarted: false,
	images: [
		{ src: imageOne, string: 'imageOne' },
		{ src: imageTwo, string: 'imageTwo' },
		{ src: imageThree, string: 'imageThree' },
	],
	currentImageIndex: 0,
	selectionContainer: null,
	// the selection container & dropdown
	isSelectCharacterShown: false,
	// all previous clicks to display on image (incorrect get hidden)
	clicksArray: [],
	// current click in percentage
	currentClickPercentage: null,
	// current click coords
	currentClickCoords: null,
	imageOne: {
		src: imageOne,
		waldo: {
			name: 'waldo',
			x: 42,
			y: 18,
			found: false,
			image: waldoImg,
		},
		odlaw: {
			name: 'odlaw',
			x: 19.7,
			y: 73.3,
			found: false,
			image: odlawImg,
		},
		wendy: {
			name: 'wendy',
			x: 29.8,
			y: 74.2,
			found: false,
			image: wendyImg,
		},
	},
	imageTwo: {
		src: imageTwo,
		waldo: {
			name: 'waldo',
			x: 65.7,
			y: 44.5,
			found: false,
			image: waldoImg,
		},
		wizard: {
			name: 'wizard',
			x: 77.3,
			y: 42.6,
			found: false,
			image: wizardImg,
		},
		odlaw: {
			name: 'odlaw',
			x: 31.9,
			y: 46.5,
			found: false,
			image: odlawImg,
		},
		wendy: {
			name: 'wendy',
			x: 52.3,
			y: 49.5,
			found: false,
			image: wendyImg,
		},
	},
	imageThree: {
		src: imageThree,
		waldo: { name: 'waldo', x: 57, y: 35.3, found: false, image: waldoImg },
		wizard: {
			name: 'wizard',
			x: 85,
			y: 84.4,
			found: false,
			image: wizardImg,
		},
		odlaw: {
			name: 'odlaw',
			x: 40.2,
			y: 60.3,
			found: false,
			image: odlawImg,
		},
		wendy: { name: 'wendy', x: 39, y: 33.2, found: false, image: wendyImg },
	},
	hasResultBeenCalculated: false,
};

function App() {
	const [layoutState, layoutDispatch] = useReducer(
		layoutReducer,
		initialLayoutState
	);
	const history = useHistory();

	// detect when all characters in an image have been found and then calculate results
	useEffect(() => {
		const allCharsFound = Object.values(
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			]
		)
			.filter((char) => char.hasOwnProperty('found'))
			.every((char) => char.found);

		if (allCharsFound && !layoutState.hasResultBeenCalculated) {
			// display results page with loading icon

			// handle all characters found but not on last image
			// add finish timestamp, calc difference, load results
			if (
				layoutState.currentImageIndex + 1 !==
				layoutState.images.length
			) {
				layoutDispatch({ type: consts.LOADING_RESULTS });
				history.push('/result');

				// calculate total time, store in firebase and return time
				addFinishTimestampAndCalculateTotal({
					image: `${
						layoutState.images[layoutState.currentImageIndex].string
					}`,
					userVisitId: consts.USER_VISIT_ID,
				}).then((res) => {
					layoutDispatch({
						type: consts.SHOW_RESULTS,
						result: res.data.totalTimeInMillis,
					});
				});
				// handle gameover - store final finish timestamp and reveal all scores
			} else {
				layoutDispatch({ type: consts.LOADING_FINAL_RESULTS });
				history.push('/leaderboard');

				addFinishTimestampAndCalculateTotal({
					image: `${
						layoutState.images[layoutState.currentImageIndex].string
					}`,
					userVisitId: consts.USER_VISIT_ID,
				}).then((res) => {
					layoutDispatch({
						type: consts.SHOW_FINAL_RESULTS,
						result: res.data.totalTimeInMillis,
					});
				});
			}
		}
	}, [layoutState, history]);

	// sign in to firebase anonymously
	useEffect(() => {
		firebase
			.auth()
			.signInAnonymously()
			.then((data) => {
				layoutDispatch({
					type: consts.SAVE_UID,
					uid: data.user.uid,
				});
			})
			.catch((err) => console.log(err));

		firebase
			.firestore()
			.collection('scores')
			.doc('all')
			.get()
			.then((res) => {
				layoutDispatch({
					type: consts.SAVE_ALL_SCORES,
					allScores: res.data(),
				});
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<React.Fragment>
			<Switch>
				<Route
					exact
					path="/"
					component={(props) => (
						<Cover {...props} layoutDispatch={layoutDispatch} />
					)}
				/>
				<Route
					exact
					path="/find"
					component={(props) => (
						<Image
							currentImage={
								layoutState[
									layoutState.images[
										layoutState.currentImageIndex
									].string
								]
							}
							currentClickPercentage={
								layoutState.currentClickPercentage
							}
							clicksArray={layoutState.clicksArray}
							isSelectCharacterShown={
								layoutState.isSelectCharacterShown
							}
							currentClickCoords={layoutState.currentClickCoords}
							layoutDispatch={layoutDispatch}
						/>
					)}
				/>
				<Route
					exact
					path="/menu"
					component={(props) => (
						<Menu
							{...props}
							layoutDispatch={layoutDispatch}
							layoutState={layoutState}
						/>
					)}
				/>
				<Route
					exact
					path="/result"
					component={(props) => (
						<Result
							{...props}
							layoutDispatch={layoutDispatch}
							layoutState={layoutState}
						/>
					)}
				/>
				<Route
					exact
					path="/leaderboard"
					component={(props) => (
						<Scoreboard
							{...props}
							bgImage={imageOne}
							layoutState={layoutState}
							layoutDispatch={layoutDispatch}
						/>
					)}
				/>
				<Route
					exact
					path="/about"
					component={(props) => (
						<About {...props} layoutDispatch={layoutDispatch} />
					)}
				/>
			</Switch>
			<GlobalStyle />
		</React.Fragment>
	);
}

export default App;
