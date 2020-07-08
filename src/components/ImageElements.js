import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ShowResult from './ShowResult';
import CharacterDropdown from './CharacterDropdown';

const UserSelection = styled.div`
	width: 40px;
	height: 40px;
	position: absolute;
	top: ${(props) =>
		props.y && `calc(${props.y}% + ${props.windowScrollY}px)`};
	left: ${(props) => props.x && props.x + '%'};
	border: solid 4px black;
	border-radius: 8px;
`;

function ImageElements({
	clicksArray,
	isSelectCharacterShown,
	currentClickPercentage,
	layoutDispatch,
	imageDims,
	addClick,
	currentClickCoords,
	currentImage,
}) {
	return (
		<>
			{/* clicked - previous clicked spaces, correct stay, incorrect fadeout */}
			{clicksArray.length > 0 &&
				clicksArray.map((result, index) => {
					return (
						<ShowResult
							key={`${result.x}${result.y}`}
							x={result.x}
							y={result.y}
							found={result.characterFound}
							windowScrollX={result.windowScrollX}
							windowScrollY={result.windowScrollY}
						/>
					);
				})}
			{/* currently clicked and showing dropdown */}
			{isSelectCharacterShown && (
				<>
					<CharacterDropdown
						layoutDispatch={layoutDispatch}
						imageHeight={imageDims.height}
						addClick={addClick}
						currentClickPercentage={currentClickPercentage}
						currentClickCoords={currentClickCoords}
						currentImage={currentImage}
					/>
					<UserSelection
						x={currentClickPercentage && currentClickPercentage.x}
						y={currentClickPercentage && currentClickPercentage.y}
						windowScrollX={currentClickPercentage.windowScrollX}
						windowScrollY={currentClickPercentage.windowScrollY}
					/>
				</>
			)}
		</>
	);
}

ImageElements.propTypes = {
	addClick: PropTypes.func,
	clicksArray: PropTypes.shape({
		length: PropTypes.number,
		map: PropTypes.func,
	}),
	currentClickCoords: PropTypes.object,
	currentClickPercentage: PropTypes.shape({
		windowScrollX: PropTypes.number,
		windowScrollY: PropTypes.number,
		x: PropTypes.number,
		y: PropTypes.number,
	}),
	currentImage: PropTypes.any,
	imageDims: PropTypes.shape({
		height: PropTypes.number,
	}),
	isSelectCharacterShown: PropTypes.bool,
	layoutDispatch: PropTypes.func,
};

export default React.memo(ImageElements);
