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
	addClick,
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
						dropdownPosition={layoutState.currentClickPercentage}
						userDispatch={layoutDispatch}
						layoutDispatch={layoutDispatch}
						currentClickCoords={layoutState.currentClickCoords}
						imageHeight={imageDims.height}
						addClick={addClick}
					/>
					<UserSelection
						x={
							layoutState.currentClickPercentage &&
							layoutState.currentClickPercentage.x
						}
						y={
							layoutState.currentClickPercentage &&
							layoutState.currentClickPercentage.y
						}
					/>
				</>
			)}
		</>
	);
}