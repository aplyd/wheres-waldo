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

const Selection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: 18%;
	left: 42%;
	border: solid 2px red;
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
			return {
				...state,
				clicked: action.clicked,
				isSelectCharacterShown: true,
			};
		default:
			return state;
	}
}

function userReducer(state, action) {
	switch (action.type) {
		case 'select character':
			return {
				...state,
				characterSelection: action.selection,
			};

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
	clicked: null,
};

//temporary, should live on the backend so users can't access
const intialUserState = {
	imageOneTargets: {
		waldo: { x: 42, y: 18 },
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
		});
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
					<Selection />
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
