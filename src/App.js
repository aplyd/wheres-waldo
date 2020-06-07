import React, { useReducer, useRef } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import image1 from './images/OTfytjA.jpg';

import { getImageDims } from './utils';

import Cover from './layouts/Cover';
import Nav from './layouts/Nav';
import Menu from './layouts/Menu';
import About from './layouts/About';
import Scoreboard from './layouts/Scoreboard';

const Container = styled.div`
	width: 100%;
	height: 100vh;
`;

const ImageContainer = styled.div`
	width: 100%;
	height: 100%;
	max-width: 1920px;
`;

const Selection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: calc(52px + 17%);
	left: 42%;
	border: solid 2px red;
`;

function reducer(state, action) {
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
		default:
			return state;
	}
}

const initialState = {
	isMenuOpen: false,
	timer: 0,
	isCoverShown: false,
	isScoreShown: false,
	isAboutShown: false,
	currentImage: image1,
	waldoCoords: { x: 0, y: 0 },
};

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const imageRef = useRef(null);

	const getClickArea = (e) => {
		e.persist();
		const imageDims = getImageDims(imageRef.current);
		const waldoX = e.clientY - 52;
		console.log(e.clientX, e.clientY);
		console.log('window width:', window.innerWidth);
		console.log({ imageDims });
	};

	return (
		<React.Fragment>
			<GlobalStyle />
			{state.isMenuOpen && <Menu dispatch={dispatch} />}
			<Container>
				<Selection />
				<Nav dispatch={dispatch} />
				<Spacer height={'52px'} />
				<ImageContainer
					onClick={(e) => {
						getClickArea(e);
					}}
				>
					<img src={image1} alt="" ref={imageRef}></img>
				</ImageContainer>
			</Container>
			{state.isCoverShown && <Cover dispatch={dispatch} />}
			{state.isScoreShown && <Scoreboard />}
			{state.isAboutShown && <About />}

			<Spacer height={'48px'} />
		</React.Fragment>
	);
}

export default App;
