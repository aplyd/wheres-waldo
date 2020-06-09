import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	height: 24px;
	width: 24px;
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
`;
export default function CharacterFound({ foundCoords }) {
	return (
		<Container x={foundCoords.x} y={foundCoords.y}>
			<h3>&#x2713;</h3>
		</Container>
	);
}
