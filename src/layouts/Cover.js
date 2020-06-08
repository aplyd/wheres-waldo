import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';
import bgImage from '../images/btsRJjC.jpg';

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
	background-color: green;
	border: none;
	color: white;
	width: 120px;
	font-size: 20px;
	height: 48px;
	border-radius: 8px;
`;

export default function Cover({ layoutDispatch }) {
	return (
		<>
			<Container>
				<Title>Where's Waldo?</Title>
				<Spacer height={'42px'} />
				<StartGameBtn
					onClick={() => layoutDispatch({ type: 'start game' })}
				>
					Start
				</StartGameBtn>
			</Container>
			<Background bgImage={bgImage} />
		</>
	);
}
