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

const Timer = styled.h1`
	color: white;
	font-size: 33px;
	top: 10.5px;
	right: 4px;
	position: absolute;
	line-height: 1em;
`;

const Title = styled.h1`
	color: white;
	padding-top: 8px;
	font-size: 33px;
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
					{window.innerWidth > 475 && <Title>Where's Waldo?</Title>}
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
