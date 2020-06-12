import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	grid-template-rows: auto;
`;

const CharacterItem = styled.div`
	background-color: white;
`;

const Image = styled.img`
	width: 100%;
`;

export default function DisplayCharacters({ characters }) {
	return (
		<Container>
			{Object.values(characters).map((char, index) => {
				return (
					<CharacterItem key={index}>
						<Image src={char.image} />
					</CharacterItem>
				);
			})}
		</Container>
	);
}
