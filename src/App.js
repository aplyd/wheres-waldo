import React, { useReducer, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import image1 from './images/OTfytjA.jpg';

import { getImageDims } from './utils';
import { useImageHeight } from './hooks/useImageHeight';

import Cover from './layouts/Cover';
import Nav from './layouts/Nav';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Scoreboard from './layouts/Scoreboard';

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
			};
		case 'show info':
			return {
				...state,
				isAboutShown: true,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				//also need to reset timer here
			};
		case 'show scores':
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: true,
				isAboutShown: false,
			};
		case 'show game':
			return {
				...state,
				isMenuOpen: false,
				isCoverShown: false,
				isScoreShown: false,
				isAboutShown: false,
			};
		case 'image resize':
			return {
				...state,
				currentImageHeight: action.height,
			};
		default:
			return state;
	}
}

function userReducer(state, action) {
	switch (action.type) {
		case 'click':
			return {
				...state,
				userClick: action.coords,
			};
		case 'selection':
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
	currentImage: image1,
	waldoCoords: { x: [42, '%'], y: [18, '%'] },
	currentImageHeight: 0,
};

//temporary, should live on the backend so users can't access
const intialUserState = {
	imageOneTargets: {
		waldo: { x: [42, '%'], y: [18, '%'] },
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
	userClick: { x: [0, '%'], y: [0, '%'] },
};

function App() {
	const [layoutState, layoutDispatch] = useReducer(
		layoutReducer,
		initialLayoutState
	);
	const [userState, userDispatch] = useReducer(userReducer, intialUserState);
	// const [imageRef, observedHeight] = useImageHeight();

	const getClickArea = (e) => {
		e.persist();
		console.log('click:');
		console.log(e.clientX, e.clientY);
		console.log('window width:', window.innerWidth);
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
					{/* <img src={image1} alt="" ref={imageRef}></img> */}
					<Image src={image1} alt=""></Image>
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
