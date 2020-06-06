import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './GlobalStyle';

import Nav from './layouts/Nav';
import Menu from './layouts/Menu';

const Container = styled.div`
	width: 100%;
	height: 100%;
`;

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<React.Fragment>
			<GlobalStyle />
			{isMenuOpen && <Menu setIsMenuOpen={setIsMenuOpen} />}
			<Container>
				<Nav setIsMenuOpen={setIsMenuOpen} />
			</Container>
		</React.Fragment>
	);
}

export default App;
