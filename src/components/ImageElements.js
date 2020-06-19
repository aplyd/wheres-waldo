import React from 'react';
import styled from 'styled-components';
import ShowResult from './ShowResult';
import CharacterDropdown from './CharacterDropdown';

//TODO - probably need to add window.scrollX to left position
const UserSelection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: ${(props) => props.y && `calc(${props.y}% + ${window.scrollY}px)`};
	left: ${(props) => props.x && props.x + '%'};
	border: solid 4px black;
	border-radius: 8px;
	${console.log(window.po)}
`;

export default function ImageElements({
	layoutState,
	layoutDispatch,
	imageDims,
	addClick,
}) {
	return (
		<>
			{/* clicked - previous clicked spaces, correct stay, incorrect fadeout */}
			{layoutState.clicksArray.length > 0 &&
				layoutState.clicksArray.map((result, index) => {
					return (
						<ShowResult
							key={index}
							x={result.x}
							y={result.y}
							found={result.characterFound}
						/>
					);
				})}
			{/* currently clicked and showing dropdown */}
			{layoutState.isSelectCharacterShown && (
				<>
					<CharacterDropdown
						dropdownPosition={layoutState.currentClickPercentage}
						userDispatch={layoutDispatch}
						layoutDispatch={layoutDispatch}
						imageHeight={imageDims.height}
						addClick={addClick}
						layoutState={layoutState}
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
