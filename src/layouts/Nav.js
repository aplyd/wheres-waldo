import React from 'react';
import styled from 'styled-components';
import { RiMenuLine } from 'react-icons/ri';
import { Spacer } from '../GlobalStyle';
import * as consts from '../constants';

const Container = styled.div`
	position: fixed;
	height: 52px;
	width: 100%;
	background-color: black;
	z-index: 1010;
	text-align: center;
`;

const MenuIcon = styled.svg`
	color: white;
	font-size: 40px;
	position: absolute;
	top: 6px;
	left: 4px;
	cursor: pointer;
`;

const Title = styled.h1`
	color: white;
	padding-top: 8px;
	font-size: 33px;
`;

export default function Nav({ layoutDispatch }) {
	return (
		<>
			<Container>
				<div
					onClick={() => layoutDispatch({ type: consts.TOGGLE_MENU })}
				>
					<MenuIcon as={RiMenuLine} />
				</div>
				<div>
					{window.innerWidth > 475 && <Title>Where's Waldo?</Title>}
				</div>
				<div></div>
			</Container>
			<Spacer height={'52px'} />
		</>
	);
}
