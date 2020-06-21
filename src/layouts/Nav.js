import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RiMenuLine } from 'react-icons/ri';
import { Spacer } from '../GlobalStyle';
import * as consts from '../constants';

import Timer from '../components/Timer';

const Container = styled.div`
	position: fixed;
	height: 52px;
	width: 100%;
	background-color: black;
	z-index: 1;
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

export default function Nav({
	layoutDispatch,
	isTimerActive,
	timer,
	setTimer,
}) {
	useEffect(() => {
		let secondsInterval = null;
		if (isTimerActive) {
			secondsInterval = setTimeout(() => {
				setTimer((timer) => timer + 1);
			}, 1000);
		} else if (!isTimerActive && timer !== 0) {
			clearInterval(secondsInterval);
		}
		return () => {
			clearInterval(secondsInterval);
		};
	}, [isTimerActive, timer, setTimer]);

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
				<div>
					<Timer timer={timer} />
				</div>
			</Container>
			<Spacer height={'52px'} />
		</>
	);
}
