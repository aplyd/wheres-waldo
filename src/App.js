import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import imageOne from './images/imageOne.jpg';
import imageTwo from './images/imageTwo.jpg';
import imageThree from './images/imageThree.jpg';
import firebase from './firebase';

import waldoImg from './images/waldo.jpg';
import wendyImg from './images/wendy.jpg';
import wizardImg from './images/wizard.jpg';
import odlawImg from './images/odlaw.jpg';

import { useImageDims } from './hooks/useImageDims';

import Cover from './layouts/Cover';
import Nav from './layouts/Nav';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Result from './layouts/Result';
import Scoreboard from './layouts/Scoreboard';
import ImageElements from './components/ImageElements';

import * as consts from './constants';

const Container = styled.div`
	width: 100%;
	/* min-width: to allow for x scrolling on mobile */
	height: 100%;
	background-color: black;
`;

const ImageContainer = styled.div`
	max-width: 1920px;
	position: relative;
	/* @media screen and (max-width: 800px) {
		height: 100vh;
		
	} */
`;

const Image = styled.img`
	/* @media screen and (max-width: 800px) {
		height: 100vh;
		width: auto;
	} */
`;

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
		case consts.TOGGLE_MENU:
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
				// areScoresShown: false,
			};
		// TODO - fix this because the structure has changed
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
				isMenuOpen: false,
				isCoverShown: false,
				areScoreShown: false,
				isAboutShown: false,
			};

		case consts.NEW_GAME:
			return initialLayoutState;

		case consts.SHOW_ABOUT:
			return {
				...state,
				isAboutShown: true,
				isMenuOpen: false,
				areScoresShown: false,
			};

		case consts.SHOW_SCORES:
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				areScoresShown: true,
				isAboutShown: false,
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
				clicksArray: [...state.clicksArray, characterFoundClick],
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
					? [...state.clicksArray, wrongClick]
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
				isResultShown: true,
				isLoadingResult: true,
				hasResultBeenCalculated: true,
			};

		case consts.SHOW_RESULTS:
			// TODO - check to see if currentUserId matches previous, auto fill in the name input
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

			nextRoundState.isResultShown = false;
			nextRoundState.hasResultBeenCalculated = false;
			return nextRoundState;

		case consts.LOADING_FINAL_RESULTS:
			return {
				...state,
				clicksArray: [],
				isLoadingResult: true,
				hasResultBeenCalculated: true,
				areScoresShown: true,
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
	isMenuOpen: false,
	isCoverShown: true,
	areScoresShown: false,
	isAboutShown: false,
	isResultShown: false,
	isLoadingResult: false,
	// TODO - having object property and global variable same name may be issue
	images: [
		{ src: imageOne, string: 'imageOne' },
		{ src: imageTwo, string: 'imageTwo' },
		{ src: imageThree, string: 'imageThree' },
	],

	currentImageIndex: 2,
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

// TODO - fix scroll issue (when selecting character)
function App() {
	const [layoutState, layoutDispatch] = useReducer(
		layoutReducer,
		initialLayoutState
	);
	const [imageDims, setImageDims] = useState({ height: 0, width: 0 });
	const [imageRef, observedDims] = useImageDims();

	// detect when all characters in an image have been found and then calculate results
	useEffect(() => {
		const allCharsFound = Object.values(
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			]
		).every((char) => char.found);

		if (allCharsFound && !layoutState.hasResultBeenCalculated) {
			// display results page with loading icon

			// handle all characters found but not on last image
			// add finish timestamp, calc difference, load results
			if (
				layoutState.currentImageIndex + 1 !==
				layoutState.images.length
			) {
				layoutDispatch({ type: consts.LOADING_RESULTS });

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
	}, [layoutState]);

	// store image dims in state
	useEffect(() => {
		if (observedDims) {
			setImageDims(observedDims);
		}
	}, [observedDims]);

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

	const getClickArea = (e) => {
		e.persist();
		// console.log({ clickX: e.clientX, clickY: e.clientY });
		// console.log({ imgHeight: imageDims.height, imgWidth: imageDims.width });

		const x = e.clientX - 20;
		const y = e.clientY - 72;

		// changed from user
		layoutDispatch({
			type: consts.CLICKED,
			// in percentages
			currentClickPercentage: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
			// in coordinates
			currentClickCoords: {
				x: e.clientX,
				y: e.clientY,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
		});
	};

	const checkUserSelection = (character) => {
		// using percentages so the image can be responsive
		// and are clicked on image will be the same

		// size waldo can be found within (width of the selection square in %)
		const selectionWidthInPercentage = ((40 / imageDims.width) * 100) / 2;
		const selectionHeightInPercentage = ((40 / imageDims.height) * 100) / 2;

		// position of the characters y coordinate in percentage
		// minus scrollY in precentage
		const charY =
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			][character].y -
			(layoutState.currentClickPercentage.windowScrollY /
				imageDims.height) *
				100;

		// position of the characters x coordinate in percentage
		// minus scrollX in precentage
		const charX =
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			][character].x -
			(layoutState.currentClickPercentage.windowScrollX /
				imageDims.width) *
				100;

		// adding the percentage the selection container is offset by
		const clickY =
			layoutState.currentClickPercentage.y +
			(20 / imageDims.height) * 100;
		const clickX =
			layoutState.currentClickPercentage.x + (20 / imageDims.width) * 100;

		// if the target character is within the user selected area
		if (
			clickX + selectionWidthInPercentage > charX &&
			clickX - selectionWidthInPercentage < charX &&
			clickY + selectionHeightInPercentage > charY &&
			clickY - selectionHeightInPercentage < charY
		) {
			return true;
		}
	};

	const addClick = (character) => {
		if (checkUserSelection(character)) {
			layoutDispatch({
				type: consts.CHARACTER_FOUND,
				character,
			});
		} else {
			layoutDispatch({
				type: consts.CHARACTER_NOT_FOUND,
			});
		}
	};

	return (
		<React.Fragment>
			<GlobalStyle />
			{layoutState.isMenuOpen && (
				<Menu
					layoutDispatch={layoutDispatch}
					layoutState={layoutState}
				/>
			)}
			{layoutState.isCoverShown && (
				<Cover layoutDispatch={layoutDispatch} />
			)}
			{layoutState.areScoresShown && (
				<Scoreboard bgImage={imageOne} layoutState={layoutState} />
			)}
			{layoutState.isAboutShown && <About />}
			{layoutState.isResultShown && (
				<Result
					layoutDispatch={layoutDispatch}
					layoutState={layoutState}
				/>
			)}

			<Container>
				<Nav layoutDispatch={layoutDispatch} />

				<ImageContainer
					onClick={(e) => {
						getClickArea(e);
					}}
				>
					{/* consolidated characterDropdown, characterReveal and userSelection into ImageElements */}
					<ImageElements
						layoutState={layoutState}
						layoutDispatch={layoutDispatch}
						imageDims={imageDims}
						addClick={addClick}
					/>

					<Image
						src={
							layoutState.images[layoutState.currentImageIndex]
								.src
						}
						alt=""
						ref={imageRef}
					></Image>
				</ImageContainer>
			</Container>

			{/* need to pass current image instead of imageOne */}
			{/* these are the different "pages" */}

			<Spacer height={'48px'} />
		</React.Fragment>
	);
}

export default App;
