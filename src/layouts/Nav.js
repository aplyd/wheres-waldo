import React from 'react';
import styled from 'styled-components';
import { RiMenuLine } from 'react-icons/ri';

const Container = styled.div`
	position: fixed;
	height: 52px;
	width: 100%;
	background-color: black;
`;

const MenuIcon = styled.svg`
	color: white;
	font-size: 44px;
	position: absolute;
	top: 4px;
	left: 4px;
	cursor: pointer;
`;

export default function Nav({ setIsMenuOpen }) {
	return (
		<Container>
			<div onClick={() => setIsMenuOpen(true)}>
				<MenuIcon as={RiMenuLine} />
			</div>
		</Container>
	);
}
