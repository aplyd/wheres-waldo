import React, { useState, useEffect } from 'react';
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

export default function Nav({ layoutDispatch, isTimerActive }) {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		let secondsInterval = null;
		if (isTimerActive) {
			secondsInterval = setTimeout(() => {
				setSeconds((seconds) => seconds + 1);
			}, 1000);
		} else if (!isTimerActive && seconds !== 0) {
			clearInterval(secondsInterval);
		}
		return () => {
			clearInterval(secondsInterval);
		};
	}, [isTimerActive, seconds]);

	return (
		<>
			<Container>
				<div onClick={() => layoutDispatch({ type: 'toggle menu' })}>
					<MenuIcon as={RiMenuLine} />
				</div>
				<div>
					<Timer>
						{(seconds / 60).toString().split('.')[0]}:
						{(seconds % 60).toString().padStart(2, '0')}
					</Timer>
				</div>
			</Container>
			<Spacer height={'52px'} />
		</>
	);
}
