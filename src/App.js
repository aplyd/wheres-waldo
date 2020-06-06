import React from 'react';
import styled from 'styled-components';
import Nav from './layouts/Nav';
import { GlobalStyle } from './GlobalStyle';

const Container = styled.div`
	width: 100%;
	height: 100%;
`;

function App() {
	return (
		<React.Fragment>
			<GlobalStyle />
			<Container>
				<Nav />
			</Container>
		</React.Fragment>
	);
}

export default App;
