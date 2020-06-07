import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { GlobalStyle, Spacer } from './GlobalStyle';
import image1 from './images/OTfytjA.jpg';

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
};

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<React.Fragment>
			<GlobalStyle />
			{state.isMenuOpen && <Menu dispatch={dispatch} />}
			<Container>
				<Nav dispatch={dispatch} />
				<ImageContainer>
					<img src={image1} alt=""></img>
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
