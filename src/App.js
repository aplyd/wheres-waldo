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
import SelectCharacter from './components/SelectCharacter';
import CharacterFound from './components/CharacterFound';

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

const UserSelection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: ${(props) => props.y && props.y + '%'};
	left: ${(props) => props.x && props.x + '%'};
	border: solid 4px black;
	border-radius: 8px;
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
			return {
				...state,
				isSelectCharacterShown: !state.isSelectCharacterShown,
				clicked: null,
			};
		case 'clicked':
			//if the dropdown and selection are already displayed, close them
			if (state.clicked) {
				return {
					...state,
					isSelectCharacterShown: false,
					clickedCoords: null,
					clicked: null,
				};
			} else {
				return {
					...state,
					clicked: action.clicked,
					clickedCoords: action.clickedCoords,
					isSelectCharacterShown: true,
				};
			}
		default:
			return state;
	}
}

function userReducer(state, action) {
	switch (action.type) {
		case 'select character from dropdown':
			return {
				...state,
				characterSelection: action.selection,
			};
		case 'character found':
			const updatedTargets = { ...state };
			//change imageOne to current image later
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
	isCoverShown: true,
	isScoreShown: false,
	isAboutShown: false,
	isImageShown: true,
	currentImage: image1,
	isSelectCharacterShown: false,
	clicked: null,
	clickedCoords: null,
};

//temporary, should live on the backend so users can't access
const intialUserState = {
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
	const [userState, userDispatch] = useReducer(userReducer, intialUserState);
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
			clicked: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
			},
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
		const waldoY = userState.imageOneTargets.waldo.y;
		const waldoX = userState.imageOneTargets.waldo.x;
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
			userDispatch({
				type: 'character found',
				character,
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
				<ImageContainer
					onClick={(e) => {
						getClickArea(e);
					}}
				>
					{/* TODO - move to seperate component */}
					{userState.imageOneTargets.waldo.found && (
						<CharacterFound
							foundCoords={userState.imageOneTargets.waldo}
						/>
					)}
					{layoutState.clicked && (
						<UserSelection
							x={layoutState.clicked && layoutState.clicked.x}
							y={layoutState.clicked && layoutState.clicked.y}
						/>
					)}
					{layoutState.isSelectCharacterShown && (
						<SelectCharacter
							dropdownPosition={layoutState.clicked}
							userDispatch={userDispatch}
							layoutDispatch={layoutDispatch}
							clickedCoords={layoutState.clickedCoords}
							imageHeight={imageDims.height}
							checkUserSelection={checkUserSelection}
						/>
					)}
					<Image src={image1} alt="" ref={imageRef}></Image>
				</ImageContainer>
			</Container>
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
