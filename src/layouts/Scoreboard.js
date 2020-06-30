import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';
import { sortLeaderboard } from '../utils';

const Background = styled.div`
	background-image: ${(props) => `url(${props.bgImage})`};
	background-size: contain;
	filter: blur(4px);
	--webkit-filter: blur(4px);
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`;

const Container = styled.div`
	height: calc(100vh - 52px);
	z-index: 1009;
	position: absolute;
	top: 52px;
	left: 0;
	right: 0;
	bottom: 0;
	&& > div {
		text-align: center;
	}
`;

const ScoresContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	@media screen and (max-width: 800px) {
		grid-template-columns: 1fr;
	}
`;

const ScoreCard = styled.div`
	width: 100%;
	height: 100%;
	grid-row: 2;
	&& > div {
		border-radius: 8px;
		overflow-x: hidden;
		overflow-y: scroll;
		width: 263px;
		height: 370px;
		background-color: white;
		margin: 140px auto 0 auto;
	}
`;

const TitleContainer = styled.div`
	text-align: center;
	&& > h1 {
		color: black;
		font-weight: bold;
		font-size: 48px;
	}
`;

export default function Scoreboard({ bgImage, layoutState }) {
	return (
		<>
			<Background bgImage={bgImage}></Background>
			<Container bgImage={bgImage}>
				<TitleContainer>
					<h1>Leaderboard</h1>
				</TitleContainer>
				<ScoresContainer>
					{['imageOne', 'imageTwo', 'imageThree'].map((i, index) => {
						const scores = sortLeaderboard(layoutState, i);
						return (
							<ScoreCard key={`${i}${index}`}>
								<div>
									<table>
										<thead>
											<tr>
												<th>#</th>
												<th>Name</th>
												<th>Time</th>
											</tr>
										</thead>
										<tbody>
											{scores.map((score, index) => {
												return (
													<tr
														key={`${score.name}${score.time}${index}`}
													>
														<td>{index + 1}</td>
														<td>{score.name}</td>
														<td>{score.time}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</ScoreCard>
						);
					})}
				</ScoresContainer>
			</Container>
		</>
	);
}
