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
import woofImg from './images/woof.png';
import odlawImg from './images/odlaw.jpg';

import { useImageDims } from './hooks/useImageDims';

import Cover from './layouts/Cover';
import Nav from './layouts/Nav';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Scoreboard from './layouts/Scoreboard';
import ImageElements from './components/ImageElements';
import * as consts from './constants';

const Container = styled.div`
	width: 100%;
	height: 100%;
	background-color: black;
`;

const ImageContainer = styled.div`
	max-width: 1920px;
	position: relative;
	@media screen and (max-width: 800px) {
		height: 100vh;
		overflow-x: scroll;
	}
`;

const Image = styled.img`
	@media screen and (max-width: 800px) {
		height: 100vh;
		width: auto;
		overflow-x: scroll;
	}
`;

const addTimestamp = firebase.functions().httpsCallable('addTimestamp');

function layoutReducer(state, action) {
	switch (action.type) {
		case consts.SAVE_UI:
			return {
				...state,
				uid: action.uid,
			};
		case consts.TOGGLE_MENU:
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
			};

		case consts.START_GAME:
			addTimestamp({ timeslot: `imageOne.start` }).catch((err) =>
				console.log(err)
			);
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isAboutShown: false,
				isImageShown: true,
				isTimerActive: true,
			};

		case consts.SHOW_INFO:
			return {
				...state,
				isAboutShown: true,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isImageShown: false,
			};

		case consts.SHOW_SCORES:
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: true,
				isAboutShown: false,
				isImageShown: false,
			};

		case consts.RESUME:
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isAboutShown: false,
				isImageShown: true,
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
			const correctClick = {
				x: state.currentClickPercentage.x,
				y: state.currentClickPercentage.y,
				windowScrollX: state.currentClickPercentage.windowScrollX,
				windowScrollY: state.currentClickPercentage.windowScrollY,
				characterFound: true,
			};

			const updateState = {
				...state,
				clicksArray: [...state.clicksArray, correctClick],
				isSelectCharacterShown: false,
			};

			updateState[state.images[state.currentImageIndex].string][
				action.character
			].found = true;

			//check if all characters have been found
			const allCharsFound = Object.values(
				updateState[state.images[state.currentImageIndex].string]
			).every((char) => char.found);

			if (allCharsFound) {
				addTimestamp({
					timeslot: `${
						state.images[state.currentImageIndex].string
					}.finish`,
				}).catch((err) => console.log(err));

				updateState.clicksArray = [];

				if (state.currentImageIndex + 1 !== state.images.length) {
					updateState.currentImageIndex = state.currentImageIndex + 1;
					addTimestamp({
						timeslot: `${
							state.images[updateState.currentImageIndex].string
						}.start`,
					}).catch((err) => console.log(err));
				} else {
					//TODO - handle game over
				}
			}
			return updateState;

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

		default:
			return state;
	}
}

const initialLayoutState = {
	uid: null,
	isMenuOpen: false,
	isTimerActive: false,
	//set back to true when finished
	isCoverShown: false,
	isScoreShown: false,
	isAboutShown: false,
	isImageShown: true,
	//TODO - having object property and global variable same name may be issue
	images: [
		{ src: imageOne, string: 'imageOne' },
		{ src: imageTwo, string: 'imageTwo' },
		{ src: imageThree, string: 'imageThree' },
	],
	currentImageIndex: 0,
	selectionContainer: null,
	//the selection container & dropdown
	isSelectCharacterShown: false,
	//all previous clicks to display on image (incorrect get hidden)
	clicksArray: [],
	//current click in percentage
	currentClickPercentage: null,
	//current click coords
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
		waldo: { name: 'waldo', x: 42, y: 18, found: false, image: waldoImg },
		wizard: { name: 'wizard', x: 0, y: 0, found: false, image: wizardImg },
		odlaw: { name: 'odlaw', x: 0, y: 0, found: false, image: odlawImg },
		woof: { name: 'woof', x: 0, y: 0, found: false, image: woofImg },
		wendy: { name: 'wendy', x: 0, y: 0, found: false, image: wendyImg },
	},
	imageThree: {
		waldo: { name: 'waldo', x: 42, y: 18, found: false, image: waldoImg },
		wizard: { name: 'wizard', x: 0, y: 0, found: false, image: wizardImg },
		odlaw: { name: 'odlaw', x: 0, y: 0, found: false, image: odlawImg },
		woof: { name: 'woof', x: 0, y: 0, found: false, image: woofImg },
		wendy: { name: 'wendy', x: 0, y: 0, found: false, image: wendyImg },
	},
};

function App() {
	const [layoutState, layoutDispatch] = useReducer(
		layoutReducer,
		initialLayoutState
	);
	const [imageDims, setImageDims] = useState({ height: 0, width: 0 });
	const [imageRef, observedDims] = useImageDims();
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		if (observedDims) {
			setImageDims(observedDims);
		}
	}, [observedDims]);

	useEffect(() => {
		firebase
			.auth()
			.signInAnonymously()
			.catch((err) => console.log(err));
	}, []);

	const getClickArea = (e) => {
		e.persist();
		// console.log({ clickX: e.clientX, clickY: e.clientY });
		// console.log({ imgHeight: imageDims.height, imgWidth: imageDims.width });

		const x = e.clientX - 20;
		const y = e.clientY - 72;

		//changed from user
		layoutDispatch({
			type: consts.CLICKED,
			//in percentages
			currentClickPercentage: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
			//in coordinates
			currentClickCoords: {
				x: e.clientX,
				y: e.clientY,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
		});
	};

	const checkUserSelection = (character) => {
		//using percentages so the image can be responsive
		//and are clicked on image will be the same

		//size waldo can be found within (width of the selection square in %)
		const selectionWidthInPercentage = ((40 / imageDims.width) * 100) / 2;
		const selectionHeightInPercentage = ((40 / imageDims.height) * 100) / 2;

		const charY =
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			][character].y;

		const charX =
			layoutState[
				layoutState.images[layoutState.currentImageIndex].string
			][character].x;

		//adding the percentage the selection container is offset by
		const clickY =
			layoutState.currentClickPercentage.y +
			// layoutState.currentClickPercentage.windowScrollY + TODO - this line needs to be a percentage
			(20 / imageDims.height) * 100;
		const clickX =
			layoutState.currentClickPercentage.x +
			// layoutState.currentClickPercentage.windowScrollX + TODO - this line needs to be a percentage
			(20 / imageDims.width) * 100;

		//if the target character is within the user selected area
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
					timer={timer}
				/>
			)}
			<Container>
				<Nav
					layoutDispatch={layoutDispatch}
					isTimerActive={layoutState.isTimerActive}
					timer={timer}
					setTimer={setTimer}
				/>
				{/* image and container */}
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
			{layoutState.isCoverShown && (
				<Cover layoutDispatch={layoutDispatch} />
			)}
			{layoutState.isScoreShown && <Scoreboard />}
			{layoutState.isAboutShown && <About />}

			<Spacer height={'48px'} />
		</React.Fragment>
	);
}

export default App;
