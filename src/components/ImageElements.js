import React from 'react';
import styled from 'styled-components';
import ShowResult from './ShowResult';
import CharacterDropdown from './CharacterDropdown';

const UserSelection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: ${(props) => props.y && props.y + '%'};
	left: ${(props) => props.x && props.x + '%'};
	border: solid 4px black;
	border-radius: 8px;
`;

export default function ImageElements({
	layoutState,
	layoutDispatch,
	imageDims,
	checkUserSelection,
}) {
	return (
		<>
			{layoutState.imageOneTargets.waldo.found && (
				<ShowResult foundCoords={layoutState.imageOneTargets.waldo} />
			)}
			{/* clicked - previous clicked spaces, correct state, incorrect fadeout */}
			{/* {layoutState.clicked && (
				
			)} */}
			{/* currently clicked and showing dropdown */}
			{layoutState.isSelectCharacterShown && (
				<>
					<CharacterDropdown
						dropdownPosition={layoutState.currentClick}
						userDispatch={layoutDispatch}
						layoutDispatch={layoutDispatch}
						clickedCoords={layoutState.clickedCoords}
						imageHeight={imageDims.height}
						checkUserSelection={checkUserSelection}
					/>
					<UserSelection
						x={
							layoutState.currentClick &&
							layoutState.currentClick.x
						}
						y={
							layoutState.currentClick &&
							layoutState.currentClick.y
						}
					/>
				</>
			)}
		</>
	);
}
