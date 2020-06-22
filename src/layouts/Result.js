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
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	@media screen and (max-width: 800px) {
		flex-direction: column;
	}
`;

const ContentContainer = styled.div`
	padding-top: 116px;
	width: 50%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	@media screen and (max-width: 800px) {
		width: 100%;
	}
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
	padding: 16px 32px;
	font-size: 16px;
	border: none;
	outline: none;
`;

const NextBtn = styled.button`
	border-radius: 8px;
	background-color: black;
	color: white;
	font-size: 18px;
	padding: 16px 32px;
	box-shadow: none;
	border: none;
`;

const AllScoresContainer = styled.div`
	padding: 52px 0 48px 0;
	width: 50%;
	display: flex;
	flex-direction: column;
	text-align: center;
	&& > h1 {
		font-size: 48px;
		font-weight: bold;
	}

	&& table {
		margin: 32px auto 0 auto;
		padding-top: 16px;
		border-collapse: collapse;
		z-index: 1000;
	}

	&& thead,
	th {
		background-color: black;
		color: white;
		height: 32px;
	}

	&& td {
		padding: 4px 24px;
	}
	@media screen and (max-width: 800px) {
		width: 100%;
	}
`;

const ScoresBackground = styled.div`
	margin: 0 auto;
	background-color: white;
	border-radius: 8px;
	min-height: 350px;
	width: 50%;
	min-width: 250px;
	position: relative;
`;

export default function Result({ username, layoutDispatch }) {
	const tempNames = [
		{
			place: 1,
			name: 'Austin',
			time: 0.45,
		},
		{
			place: 2,
			name: 'George',
			time: 1.12,
		},
		{
			place: 3,
			name: 'Sam',
			time: 2.34,
		},
		{
			place: 4,
			name: 'Jeff',
			time: 3.15,
		},
	];

	return (
		<>
			<Background />
			<Container>
				<ContentContainer>
					<Spacer height={'24px'} />
					<Title>Good job!</Title>
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
				<AllScoresContainer>
					<Spacer height={'82px'} />
					<h1>High Scores</h1>
					<Spacer height={'36px'} />
					<ScoresBackground>
						<div></div>
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Time</th>
								</tr>
							</thead>
							<tbody>
								{tempNames.map((score) => {
									return (
										<tr key={`${score.name}${score.time}`}>
											<td>{score.place}</td>
											<td>{score.name}</td>
											<td>{score.time}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</ScoresBackground>
				</AllScoresContainer>
			</Container>
		</>
	);
}
