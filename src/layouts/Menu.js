import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { Spacer } from '../GlobalStyle';
import * as consts from '../constants';

const Container = styled.div`
	position: fixed;
	z-index: 1011;
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
	padding-top: 96px;
	&& > h2 {
		color: white;
		font-size: 24px;
	}
`;

const CharacterPreviews = styled.div`
	display: flex;
	flex-direction: row;
	padding-top: 94px;
`;

const Character = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: 0 4px;
	&& > h2 {
		text-transform: capitalize;
	}
	&& > img {
		background-color: white;
		border-radius: 8px;
		border: 2px solid black;
		width: 80px;
		height: 80px;
	}
`;

export default function Menu({ layoutDispatch, layoutState }) {
	const menuItems = [
		{
			title: 'Resume',
			action: () => layoutDispatch({ type: consts.RESUME }),
		},
		{
			title: 'New Game',
			action: () => layoutDispatch({ type: consts.START_GAME }),
		},
		{
			title: 'Scoreboard',
			action: () => layoutDispatch({ type: consts.SHOW_SCORES }),
		},
		{
			title: 'Info',
			action: () => layoutDispatch({ type: consts.SHOW_INFO }),
		},
	];

	return (
		<Container>
			<div onClick={() => layoutDispatch({ type: consts.TOGGLE_MENU })}>
				<CloseIcon as={MdClose} />
			</div>

			<MenuItemsContainer>
				<Spacer height={'96px'} />

				{menuItems.map((item, index) => {
					return (
						<React.Fragment key={index}>
							<MenuItem onClick={item.action}>
								<h2>{item.title}</h2>
							</MenuItem>
						</React.Fragment>
					);
				})}
				<CharacterPreviews>
					{Object.values(
						layoutState[
							layoutState.images[layoutState.currentImageIndex]
								.string
						]
					).map((char, index) => {
						return (
							<Character key={index}>
								<img src={char.image} alt="" />
								<h2>{char.name}</h2>
							</Character>
						);
					})}
				</CharacterPreviews>
			</MenuItemsContainer>
		</Container>
	);
}
