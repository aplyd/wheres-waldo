import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { Spacer } from '../GlobalStyle';

const Container = styled.div`
	position: fixed;
	z-index: 1000;
	width: 100%;
	height: 100%;
	background-color: black;
	color: white;
	&& > div {
		color: white;
	}
`;

const CloseIcon = styled.svg`
	position: absolute;
	top: 4px;
	left: 4px;
	color: white !important;
	fill: white !important;
	cursor: pointer;
	font-size: 44px;
`;

const MenuItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	height: 60%;
`;

const MenuItem = styled.div`
	cursor: pointer;
	&& > h2 {
		color: white;
		font-size: 24px;
	}
`;

export default function Menu({ dispatch }) {
	const resume = {
		title: 'Resume',
		action: () => dispatch({ type: 'show game' }),
	};

	const info = {
		title: 'Info',
		action: () => dispatch({ type: 'show info' }),
	};

	const newGame = {
		title: 'New Game',
		action: () => dispatch({ type: 'start game' }),
	};

	const scoreboard = {
		title: 'Scoreboard',
		action: () => dispatch({ type: 'show scores' }),
	};

	return (
		<Container>
			<div onClick={() => dispatch({ type: 'toggle menu' })}>
				<CloseIcon as={MdClose} />
			</div>

			<MenuItemsContainer>
				<Spacer height={'24px'} />
				{[resume, info, newGame, scoreboard].map((item, index) => {
					return (
						<React.Fragment key={index}>
							<Spacer height={'24px'} />
							<MenuItem onClick={item.action}>
								<h2>{item.title}</h2>
							</MenuItem>
						</React.Fragment>
					);
				})}
			</MenuItemsContainer>
		</Container>
	);
}
