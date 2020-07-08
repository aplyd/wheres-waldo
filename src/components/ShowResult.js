import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { MdClose, MdCheck } from 'react-icons/md';

const Container = styled.div`
	height: 28px;
	width: 28px;
	background-color: black;
	color: white;
	border-radius: 8px;
	position: absolute;
	top: ${(props) => `calc(${props.y}% + 7px + ${props.windowScrollY}px)`};
	left: ${(props) => `calc(${props.x}% + 7px)`};
	display: flex;
	justify-content: center;
	align-items: center;
	&& > h3 {
		font-weight: bold;
		cursor: default;
	}
`;

const WrongContainer = styled(Container)`
	-webkit-animation: ${(props) =>
		props.found
			? null
			: `fade-out-bck 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s both`};
	animation: ${(props) =>
		props.found
			? null
			: `fade-out-bck 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s both`};
	@-webkit-keyframes fade-out-bck {
		0% {
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
			opacity: 1;
		}
		100% {
			-webkit-transform: translateZ(-80px);
			transform: translateZ(-80px);
			opacity: 0;
		}
	}
	@keyframes fade-out-bck {
		0% {
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
			opacity: 1;
		}
		100% {
			-webkit-transform: translateZ(-80px);
			transform: translateZ(-80px);
			opacity: 0;
		}
	}
`;

const CorrectContainer = styled(Container)`
	-webkit-animation: scale-down-center 0.4s
		cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	animation: scale-down-center 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	@-webkit-keyframes scale-down-center {
		0% {
			-webkit-transform: scale(0.5);
			transform: scale(0.5);
		}
		100% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
	@keyframes scale-down-center {
		0% {
			-webkit-transform: scale(0.5);
			transform: scale(0.5);
		}
		100% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
`;

const Icon = styled.svg`
	color: white;
	font-size: 24px;
`;

export default function ShowResult({
	x,
	y,
	found,
	windowScrollX,
	windowScrollY,
}) {
	return (
		<>
			{found ? (
				<CorrectContainer
					x={x}
					y={y}
					windowScrollX={windowScrollX}
					windowScrollY={windowScrollY}
				>
					<Icon as={MdCheck} />
				</CorrectContainer>
			) : (
				<WrongContainer
					x={x}
					y={y}
					windowScrollX={windowScrollX}
					windowScrollY={windowScrollY}
				>
					<Icon as={MdClose} />
				</WrongContainer>
			)}
		</>
	);
}

ShowResult.propTypes = {
	found: PropTypes.bool,
	windowScrollX: PropTypes.number,
	windowScrollY: PropTypes.number,
	x: PropTypes.number,
	y: PropTypes.number,
};
