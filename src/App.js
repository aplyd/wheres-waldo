import React, { useReducer, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import image1 from './images/OTfytjA.jpg';

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
		case 'close character selection':
			const allClicks =
				state.clicked.length > 0
					? [...state.clicked, state.currentClick]
					: [state.currentClick];
			return {
				...state,
				isSelectCharacterShown: !state.isSelectCharacterShown,
				clicked: allClicks,
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
					// clicked: [...state.clicked, action.clicked],
					clickedCoords: action.clickedCoords,
					currentClick: action.clicked,
					isSelectCharacterShown: true,
				};
			}
		case 'select character from dropdown':
			return {
				...state,
				characterSelection: action.selection,
			};
		case 'character found':
			const updatedTargets = { ...state };
			//TODO - change imageOne to current image later
			updatedTargets.imageOneTargets[action.character].found = true;
			return updatedTargets;
		default:
			return state;
	}
}

const initialLayoutState = {
	isMenuOpen: false,
	timer: 0,
	//set back to true when finished
	isCoverShown: false,
	isScoreShown: false,
	isAboutShown: false,
	isImageShown: true,
	currentImage: image1,
	isSelectCharacterShown: false,
	clicked: [],
	currentClick: null,
	clickedCoords: null,
	imageOneTargets: {
		waldo: { x: 42, y: 18, found: false },
		other: {},
	},
	imageTwoTargets: {
		waldo: {},
		other: {},
	},
	imageThreeTargets: {
		waldo: {},
		other: {},
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
			clicked: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
			},
			//in coordinates
			clickedCoords: {
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
		const waldoY = layoutState.imageOneTargets.waldo.y;
		const waldoX = layoutState.imageOneTargets.waldo.x;
		//adding the percentage the selection container is offset by
		const clickY = layoutState.clicked.y + (20 / imageDims.height) * 100;
		const clickX = layoutState.clicked.x + (20 / imageDims.width) * 100;

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
			layoutDispatch({
				type: 'clicked',
			});
		} else {
			//TODO - need to add to reducer
			layoutDispatch({
				type: 'character not found',
			});
			layoutDispatch({
				type: 'clicked',
			});
		}
	};

	return (
		<React.Fragment>
			<GlobalStyle />
			{layoutState.isMenuOpen && <Menu layoutDispatch={layoutDispatch} />}
			<Container>
				<Nav layoutDispatch={layoutDispatch} />
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
						checkUserSelection={checkUserSelection}
					/>
					<Image src={image1} alt="" ref={imageRef}></Image>
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
