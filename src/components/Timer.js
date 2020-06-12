import React from 'react';
import styled from 'styled-components';

const Container = styled.h1`
	color: white;
	font-size: 33px;
	top: 10.5px;
	right: 4px;
	position: absolute;
	line-height: 1em;
`;

export default function Timer({ timer }) {
	return (
		<Container>
			{(timer / 60).toString().split('.')[0]}:
			{(timer % 60).toString().padStart(2, '0')}
		</Container>
	);
}
