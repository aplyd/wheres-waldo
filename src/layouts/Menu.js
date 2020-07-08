import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { Spacer } from '../GlobalStyle';
import { useHistory } from 'react-router-dom';

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

export default function Menu({ layoutState }) {
	const history = useHistory();

	const menuItems = [
		{
			title: 'Find',
			action: () => {
				history.push('/find');
			},
		},
		{
			title: 'Leaderboard',
			action: () => history.push('/leaderboard'),
		},
		{
			title: 'About',
			action: () => history.push('/about'),
		},
	];

	const characters = Object.entries(
		layoutState[layoutState.images[layoutState.currentImageIndex].string]
	).filter((char) => {
		if (char[0] !== 'src') {
			return char[1];
		}
		return null;
	});

	return (
		<Container>
			<div
				onClick={() => {
					history.goBack();
				}}
			>
				<CloseIcon as={MdClose} />
			</div>

			<MenuItemsContainer>
				<Spacer height={'96px'} />

				{menuItems.map((item, index) => {
					return (
						<React.Fragment key={item.title}>
							<MenuItem onClick={item.action}>
								<h2>{item.title}</h2>
							</MenuItem>
						</React.Fragment>
					);
				})}
				<CharacterPreviews>
					{characters.map((char, index) => {
						return (
							<Character key={char[1].name + 123}>
								<img src={char[1].image} alt="" />
								<h2>{char[1].name}</h2>
							</Character>
						);
					})}
				</CharacterPreviews>
			</MenuItemsContainer>
		</Container>
	);
}

Menu.propTypes = {
	layoutState: PropTypes.shape({
		currentImageIndex: PropTypes.number,
		images: PropTypes.array,
	}),
};
