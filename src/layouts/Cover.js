import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';

const Container = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;
const Title = styled.h1`
	font-size: 48px;
`;

const StartGameBtn = styled.button`
	background-color: green;
	border: none;
	color: white;
	width: 88px;
	height: 48px;
	border-radius: 8px;
`;

export default function Cover({ layoutDispatch }) {
	return (
		<Container>
			<Title>Where's Waldo?</Title>
			<Spacer height={'24px'} />
			<StartGameBtn
				onClick={() => layoutDispatch({ type: 'start game' })}
			>
				Start
			</StartGameBtn>
		</Container>
	);
}
