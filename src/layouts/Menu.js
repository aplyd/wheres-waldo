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

const Space = styled(Spacer)`
	height: 20%;
`;

export default function Menu({ setIsMenuOpen }) {
	const about = {
		title: 'About',
		action: () => console.log('about'),
	};

	const newGame = {
		title: 'New Game',
		action: () => console.log('new game'),
	};

	const scoreboard = {
		title: 'Scoreboard',
		action: () => console.log('scoreboard'),
	};

	return (
		<Container>
			<div onClick={() => setIsMenuOpen(false)}>
				<CloseIcon as={MdClose} />
			</div>
			<Space />
			<MenuItemsContainer>
				{[about, newGame, scoreboard].map((item, index) => {
					return (
						<MenuItem onClick={item.action} key={index}>
							<h2>{item.title}</h2>
						</MenuItem>
					);
				})}
			</MenuItemsContainer>
			<Space />
		</Container>
	);
}
