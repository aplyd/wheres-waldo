import React from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

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

export default function Nav() {
	return (
		<Container>
			<div onClick={() => console.log('hello')}>
				<MenuIcon as={FiMenu} />
			</div>
		</Container>
	);
}
