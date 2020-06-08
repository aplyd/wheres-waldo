import React from 'react';
import styled from 'styled-components';
import { RiMenuLine } from 'react-icons/ri';
import { Spacer } from '../GlobalStyle';

const Container = styled.div`
	position: fixed;
	height: 52px;
	width: 100%;
	background-color: black;
	z-index: 1;
`;

const MenuIcon = styled.svg`
	color: white;
	font-size: 44px;
	position: absolute;
	top: 4px;
	left: 4px;
	cursor: pointer;
`;

const Timer = styled.h1`
	color: white;
	font-size: 44px;
	top: 4px;
	right: 4px;
	position: absolute;
	line-height: 1em;
`;

export default function Nav({ layoutDispatch }) {
	return (
		<Container>
			<div onClick={() => layoutDispatch({ type: 'toggle menu' })}>
				<MenuIcon as={RiMenuLine} />
			</div>
			<div>
				<Timer>0:00</Timer>
			</div>
			<Spacer height={'52px'} />
		</Container>
	);
}
