import React from 'react';
import styled from 'styled-components';
import { Spacer } from '../GlobalStyle';
import * as consts from '../constants';
import { AiOutlineLoading } from 'react-icons/ai';
import { getMinutesFromMillis, sortLeaderboard } from '../utils';
import { useHistory } from 'react-router-dom';

const Background = styled.div`
	position: fixed;
	z-index: 1004;
	width: 110%;
	height: 100%;
	background-image: ${(props) => `url(${props.bgImage})`};
	background-repeat: repeat-y;
	background-size: auto;
	filter: blur(4px);
	--webkit-filter: blur(4px);
`;

const Container = styled.div`
	z-index: 1005;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: calc(100% - 52px);
	display: flex;
	flex-direction: row;
	@media screen and (max-width: 800px) {
		flex-direction: column;
	}
`;

const ContentContainer = styled.div`
	padding-top: 104px;
	width: 50%;
	height: calc(100% - 52px);
	min-height: 600px;
	display: flex;
	flex-direction: column;
	position: relative;
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
	padding: 25px 32px 16px 32px;
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
		margin: 0 auto;
		padding-top: 16px;
		border-collapse: collapse;
		z-index: 1000;
		width: 300px;
	}

	&& thead,
	th {
		background-color: black;
		color: white;
		height: 32px;
	}

	&& td {
		max-width: 130px;
		padding: 8px 24px;
		white-space: nowrap;
	}
	@media screen and (max-width: 800px) {
		width: 100%;
	}
`;

const TR = styled.tr`
	background-color: ${(props) => (props.currentVisit ? 'yellow' : null)};
`;

const ScoresBackground = styled.div`
	margin: 0 auto;
	background-color: white;
	border-radius: 8px;
	height: 370px;
	overflow-y: scroll;
	overflow-x: hidden;
	width: 300px;
	position: relative;
`;

const LoadingIcon = styled.svg`
	position: absolute;
	z-index: 9999;
	font-size: 80px;
	top: 50vh;
	left: calc(50% - 40px);
	color: black !important;
	animation: spin 1s linear infinite;
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;

export default function Result({ layoutDispatch, layoutState }) {
	const history = useHistory();
	return (
		<>
			<Background
				bgImage={layoutState.images[layoutState.currentImageIndex].src}
			/>
			<Container>
				<ContentContainer>
					{layoutState.isLoadingResult ? (
						<LoadingIcon as={AiOutlineLoading} />
					) : (
						<>
							<Spacer height={'24px'} />
							<Title>Good job!</Title>
							<Spacer height={'24px'} />
							<SubTitle>your time</SubTitle>{' '}
							<Time>
								{getMinutesFromMillis(
									layoutState.allScores.userScores[
										layoutState.images[
											layoutState.currentImageIndex
										].string
									][consts.USER_VISIT_ID]
								)}
							</Time>
							<Spacer height={'48px'} />
							<Prompt>Add your name to the leaderboard?</Prompt>
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
								value={layoutState.allScores.userScores.name}
								maxLength="10"
							/>
							<Spacer height={'48px'} />
							<NextBtn
								type="button"
								onClick={() => {
									layoutDispatch({
										type: consts.NEXT_ROUND,
									});
									history.push('/find');
								}}
							>
								Next Round
							</NextBtn>
						</>
					)}
				</ContentContainer>
				<AllScoresContainer>
					<Spacer height={'82px'} />
					<h1>Leaderboard</h1>
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
								{layoutState.allScores &&
									sortLeaderboard(
										layoutState,
										layoutState.images[
											layoutState.currentImageIndex
										].string,
										consts.USER_VISIT_ID
									).map((user, index) => {
										return (
											<TR
												key={`${index}${user.uid}`}
												currentVisit={user.currentVisit}
											>
												<td>{index + 1}</td>
												<td>
													{user.name
														? user.name
														: 'anonymous'}
												</td>
												<td>
													{getMinutesFromMillis(
														user.time
													)}
												</td>
											</TR>
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
