import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	height: calc(100vh - 52px);
	top: 52px;
	position: absolute;
	background-color: tan;
	z-index: 1004;
`;

export default function About() {
	return <Container></Container>;
}
