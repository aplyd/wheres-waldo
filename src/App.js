import React, { useReducer, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import imageOne from './images/OTfytjA.jpg';

import { useImageDims } from './hooks/useImageDims';

import Cover from './layouts/Cover';
import Nav from './layouts/Nav';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Scoreboard from './layouts/Scoreboard';
import ImageElements from './components/ImageElements';

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
	/* cursor: none; */
`;

const UserSelection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: ${(props) => props.y};
	left: ${(props) => props.x};
	border: solid 4px black;
	border-radius: 8px;
`;

function layoutReducer(state, action) {
	switch (action.type) {
		case 'toggle menu':
			return { ...state, isMenuOpen: !state.isMenuOpen };

		case 'start game':
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isAboutShown: false,
				isImageShown: true,
			};

		case 'show info':
			return {
				...state,
				isAboutShown: true,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isImageShown: false,
				//also need to reset timer here
			};

		case 'show scores':
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: true,
				isAboutShown: false,
				isImageShown: false,
			};

		case 'resume':
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isAboutShown: false,
				isImageShown: true,
			};

		case 'image resize':
			return {
				...state,
				currentImageHeight: action.height,
			};

		case 'clicked':
			//if the dropdown and selection are already displayed, close them
			if (state.isSelectCharacterShown) {
				return {
					...state,
					isSelectCharacterShown: false,
				};
			} else {
				return {
					...state,
					currentClickCoords: action.currentClickCoords,
					currentClickPercentage: action.currentClickPercentage,
					isSelectCharacterShown: true,
				};
			}

		case 'character found':
			const correctClick = {
				x: state.currentClickPercentage.x,
				y: state.currentClickPercentage.y,
				characterFound: true,
			};

			const updateState = {
				...state,
				clicksArray: [...state.clicksArray, correctClick],
				isSelectCharacterShown: false,
			};

			//TODO - need to update this so that it handles any image
			updateState.imageOne.waldo.found = true;

			return updateState;

		case 'character not found':
			const wrongClick = {
				x: state.currentClickPercentage.x,
				y: state.currentClickPercentage.y,
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
		case 'toggle selection container':
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
	isMenuOpen: false,
	isTimerActive: false,
	//set back to true when finished
	isCoverShown: false,
	isScoreShown: false,
	isAboutShown: false,
	isImageShown: true,
	currentImage: imageOne,
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
		waldo: { name: 'waldo', x: 42, y: 18, found: false },
		wizard: { name: 'wizard', x: 0, y: 0, found: false },
		odlaw: { name: 'odlaw', x: 0, y: 0, found: false },
		woof: { name: 'woof', x: 0, y: 0, found: false },
		wendy: { name: 'wendy', x: 0, y: 0, found: false },
	},
	imageTwo: {
		waldo: { name: 'waldo', x: 42, y: 18, found: false },
		wizard: { name: 'wizard', x: 0, y: 0, found: false },
		odlaw: { name: 'odlaw', x: 0, y: 0, found: false },
		woof: { name: 'woof', x: 0, y: 0, found: false },
		wendy: { name: 'wendy', x: 0, y: 0, found: false },
	},
	imageThree: {
		waldo: { name: 'waldo', x: 42, y: 18, found: false },
		wizard: { name: 'wizard', x: 0, y: 0, found: false },
		odlaw: { name: 'odlaw', x: 0, y: 0, found: false },
		woof: { name: 'woof', x: 0, y: 0, found: false },
		wendy: { name: 'wendy', x: 0, y: 0, found: false },
	},
};

//TODO - add dragging support for user selection

function App() {
	const [layoutState, layoutDispatch] = useReducer(
		layoutReducer,
		initialLayoutState
	);
	const [imageDims, setImageDims] = useState({ height: 0, width: 0 });
	const [imageRef, observedDims] = useImageDims();

	useEffect(() => {
		if (observedDims) {
			setImageDims(observedDims);
		}
	}, [observedDims]);

	const getClickArea = (e) => {
		e.persist();
		const x = e.clientX - 20;
		const y = e.clientY - 72;

		//changed from user
		layoutDispatch({
			type: 'clicked',
			//in percentages
			currentClickPercentage: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
			},
			//in coordinates
			currentClickCoords: {
				x: e.clientX,
				y: e.clientY,
			},
		});
	};

	const checkUserSelection = (character) => {
		//using percentages so the image can be responsive
		//and are clicked on image will be the same

		//size waldo can be found within (width of the selection square in %)
		const selectionWidthInPercentage = ((40 / imageDims.width) * 100) / 2;
		const selectionHeightInPercentage = ((40 / imageDims.height) * 100) / 2;

		//TODO - change this function to accept any character, not just waldo
		const waldoY = layoutState.imageOne.waldo.y;
		const waldoX = layoutState.imageOne.waldo.x;
		console.log(waldoX);

		//adding the percentage the selection container is offset by
		const clickY =
			layoutState.currentClickPercentage.y +
			(20 / imageDims.height) * 100;
		const clickX =
			layoutState.currentClickPercentage.x + (20 / imageDims.width) * 100;

		//if the target character is within the user selected area
		if (
			clickX + selectionWidthInPercentage > waldoX &&
			clickX - selectionWidthInPercentage < waldoX &&
			clickY + selectionHeightInPercentage > waldoY &&
			clickY - selectionHeightInPercentage < waldoY
		) {
			return true;
		}
	};

	const addClick = (character) => {
		if (checkUserSelection(character)) {
			layoutDispatch({
				type: 'character found',
				character,
			});
		} else {
			layoutDispatch({
				type: 'character not found',
			});
		}
	};

	return (
		<React.Fragment>
			<GlobalStyle />
			{layoutState.isMenuOpen && <Menu layoutDispatch={layoutDispatch} />}
			<Container>
				<Nav
					layoutDispatch={layoutDispatch}
					isTimerActive={layoutState.isTimerActive}
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
						src={layoutState.currentImage}
						alt=""
						ref={imageRef}
						// onMouseMove={(e) =>
						// 	layoutDispatch({
						// 		type: 'toggle selection container',
						// 		coords: { x: e.clientX, y: e.clientY },
						// 	})
						// }
					></Image>
					{/* {layoutState.selectionContainer && (
						<UserSelection
							x={layoutState.selectionContainer.coords.x}
							y={layoutState.selectionContainer.coords.y}
						/>
					)} */}
				</ImageContainer>
			</Container>
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
