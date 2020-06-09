import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	height: 28px;
	width: 28px;
	background-color: black;
	color: white;
	border-radius: 8px;
	position: absolute;
	top: ${(props) => `calc(${props.y}% - 12px)`};
	left: ${(props) => `calc(${props.x}% - 12px)`};
	display: flex;
	justify-content: center;
	align-items: center;
	&& > h3 {
		font-weight: bold;
	}

	-webkit-animation: ${(props) =>
		props.found
			? null
			: `fade-out-bck 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) 1s both`};
	animation: ${(props) =>
		props.found
			? null
			: `fade-out-bck 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) 1s both`};
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
export default function ShowResult({ foundCoords, found }) {
	return (
		<Container x={foundCoords.x} y={foundCoords.y} found={found}>
			{found ? <h3>&#x2713;</h3> : <h3>X</h3>}
		</Container>
	);
}
