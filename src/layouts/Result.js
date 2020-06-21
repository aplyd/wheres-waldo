import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';
import bgImage1 from '../images/imageOne.jpg';
import bgImage2 from '../images/imageTwo.jpg';
import bgImage3 from '../images/imageThree.jpg';
import * as consts from '../constants';

const Background = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: url(${bgImage1});
	background-repeat: repeat-y;
	background-size: cover;
	filter: blur(4px);
	--webkit-filter: blur(4px);
`;

const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

const ContentContainer = styled.div`
	padding-top: 52px;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 48px;
	font-weight: bold;
`;

const SubTitle = styled.p``;

const Time = styled.h2`
	font-size: 36px;
`;

const Prompt = styled.p`
	font-size: 40px;
	font-weight: bold;
	max-width: 400px;
	text-align: center;
`;

const NameInput = styled.input`
	border-radius: 8px;
	padding: 8px 16px;
	font-size: 16px;
	border: none;
	outline: none;
`;

const NextBtn = styled.button`
	border-radius: 4px;
	background-color: black;
	color: white;
	font-size: 18px;
	padding: 16px 32px;
	box-shadow: none;
	border: none;
`;
export default function Result({ username, layoutDispatch }) {
	return (
		<>
			<Background />
			<Container>
				<Spacer height={'64px'} />
				<ContentContainer>
					<Title>Nice!</Title>
					<Spacer height={'24px'} />
					<SubTitle>your time</SubTitle> <Time>0:40</Time>
					<Spacer height={'48px'} />
					<Prompt>Add your name to the scoreboard?</Prompt>
					<Spacer height={'24px'} />
					<NameInput
						placeholder="Name"
						autoFocus
						onChange={(e) =>
							layoutDispatch({
								type: consts.SAVE_USERNAME,
								username: e.target.value,
							})
						}
						value={username}
					/>
					<Spacer height={'48px'} />
					<NextBtn type="button">Next Round</NextBtn>
				</ContentContainer>
			</Container>
		</>
	);
}
