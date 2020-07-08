import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';
import bgImage from '../images/imageTwo.jpg';
import * as consts from '../constants';
import Nav from '../layouts/Nav';

const Background = styled.div`
	background-image: url(${bgImage});
	top: 0;
	left: 0;
	height: 100%;
	overflow: hidden;
	width: 100%;
	background-repeat: repeat-y;
	background-size: cover;
	filter: blur(4px);
	--webkit-filter: blur(4px);
	position: fixed;
	z-index: 1003;
`;

const Container = styled.div`
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: 1004;
`;
const Title = styled.h1`
	font-size: 48px;
	font-weight: bold;
`;

const StartGameBtn = styled.button`
	background-color: black;
	border: none;
	color: white;
	width: 140px;
	font-size: 20px;
	height: 68px;
	border-radius: 8px;
`;

export default function Cover({ layoutDispatch }) {
	const history = useHistory();
	return (
		<>
			<Nav layoutDispatch={layoutDispatch} />
			<Container>
				<Title>Where's Waldo?</Title>
				<Spacer height={'62px'} />
				<StartGameBtn
					onClick={() => {
						layoutDispatch({ type: consts.START_GAME });
						history.push('/find');
					}}
				>
					Start
				</StartGameBtn>
			</Container>
			<Background bgImage={bgImage} />
		</>
	);
}
