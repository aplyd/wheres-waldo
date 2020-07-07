import React from 'react';
import styled from 'styled-components';
import { getMinutesFromMillis, sortLeaderboard } from '../utils';
import * as consts from '../constants';

const Background = styled.div`
	background-image: ${(props) => `url(${props.bgImage})`};
	background-size: auto;
	filter: blur(4px);
	--webkit-filter: blur(4px);
	position: fixed;
	z-index: 1003;
	width: 100%;
	height: calc(100% - 52px);
`;

const Container = styled.div`
	height: calc(100% - 52px);
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
	grid-template-rows: 1;
	@media only screen and (max-width: 940px) {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr 1fr;
	}
`;

const ScoreCard = styled.div`
	width: 100%;
	height: 100%;
	text-align: center;
	&& > h2 {
		padding: 48px 0 12px 0;
	}

	&& > div {
		border-radius: 8px;
		overflow-x: hidden;
		overflow-y: scroll;
		width: 300px;
		height: 470px;
		background-color: white;
		margin: 24px auto 0 auto;
	}

	&& table {
		border-collapse: collapse;
		width: 300px;
		margin: 0 auto;
	}

	&& thead,
	th {
		background-color: black;
		color: white;
		height: 32px;
	}

	&& td {
		max-width: 130px;
		min-width: 40px;
		padding: 8px 24px;
		white-space: nowrap;
	}
`;

const TR = styled.tr`
	background-color: ${(props) => (props.currentVisit ? 'yellow' : null)};
`;

const TitleContainer = styled.div`
	text-align: center;
	&& > h1 {
		padding-top: 48px;
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
						const scores = sortLeaderboard(
							layoutState,
							i,
							consts.USER_VISIT_ID
						);
						return (
							<ScoreCard key={`${i}${index}`}>
								<h2>{`Round ${index + 1}`}</h2>
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
													<TR
														key={`${score.name}${score.time}${index}`}
														currentVisit={
															score.currentVisit
														}
													>
														<td>{index + 1}</td>
														<td>
															{score.name
																? score.name
																: 'anonymous'}
														</td>
														<td>
															{getMinutesFromMillis(
																score.time
															)}
														</td>
													</TR>
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
