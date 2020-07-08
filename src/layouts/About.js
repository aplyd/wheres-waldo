import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';

const Container = styled.div`
	width: 100%;
	height: calc(100vh - 52px);
	top: 52px;
	position: absolute;
	background-color: tan;
	z-index: 1004;
	max-width: 1290px;
	display: grid;
	grid-template-columns: 1f 1fr;
	grid-template-rows: 1fr 1fr;
`;

export default function About({ layoutDispatch }) {
	return (
		<>
			<Nav layoutDispatch={layoutDispatch} />
			<Container></Container>
		</>
	);
}
