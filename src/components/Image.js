import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ImageElements from './ImageElements';
import * as consts from '../constants';
import useResizeObserver from '../hooks/useResizeObserver';

const Container = styled.div`
	width: 100%;
	/* min-width: to allow for x scrolling on mobile */
	height: 100%;
`;

const ImageContainer = styled.div`
	width: 100%;
	height: 100%;
	max-width: 1920px;
	position: relative;
	/* @media screen and (max-width: 800px) {
		height: 100vh;
	} */
`;

const Img = styled.img`
	/* @media screen and (max-width: 800px) {
		height: 100vh;
		width: auto;
	} */
`;

const Image = ({
	images,
	currentImage,
	layoutDispatch,
	clicksArray,
	isSelectCharacterShown,
	currentClickPercentage,
	currentClickCoords,
}) => {
	const [imageDims, setImageDims] = useState({ height: 0, width: 0 });
	const [ref, entry] = useResizeObserver();

	// store image dims in state
	useEffect(() => {
		if (entry.contentRect) {
			setImageDims({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			});
		}
	}, [entry]);

	const getClickArea = (e) => {
		e.persist();

		const x = e.clientX - 20;
		const y = e.clientY - 72;

		// changed from user
		layoutDispatch({
			type: consts.CLICKED,
			// in percentages
			currentClickPercentage: {
				x: (x / imageDims.width) * 100,
				y: (y / imageDims.height) * 100,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
			// in coordinates
			currentClickCoords: {
				x: e.clientX,
				y: e.clientY,
				windowScrollY: window.scrollY,
				windowScrollX: window.scrollX,
			},
		});
	};

	const checkUserSelection = (character) => {
		// using percentages so the image can be responsive
		// and are clicked on image will be the same

		// size waldo can be found within (width of the selection square in %)
		const selectionWidthInPercentage = ((40 / imageDims.width) * 100) / 2;
		const selectionHeightInPercentage = ((40 / imageDims.height) * 100) / 2;

		// position of the characters y coordinate in percentage
		// minus scrollY in precentage
		const charY =
			currentImage[character].y -
			(currentClickPercentage.windowScrollY / imageDims.height) * 100;

		// position of the characters x coordinate in percentage
		// minus scrollX in precentage
		const charX =
			currentImage[character].x -
			(currentClickPercentage.windowScrollX / imageDims.width) * 100;

		// adding the percentage the selection container is offset by
		const clickY = currentClickPercentage.y + (20 / imageDims.height) * 100;
		const clickX = currentClickPercentage.x + (20 / imageDims.width) * 100;

		// if the target character is within the user selected area
		if (
			clickX + selectionWidthInPercentage > charX &&
			clickX - selectionWidthInPercentage < charX &&
			clickY + selectionHeightInPercentage > charY &&
			clickY - selectionHeightInPercentage < charY
		) {
			return true;
		}
	};

	const addClick = (character) => {
		if (checkUserSelection(character)) {
			layoutDispatch({
				type: consts.CHARACTER_FOUND,
				character,
			});
		} else {
			layoutDispatch({
				type: consts.CHARACTER_NOT_FOUND,
			});
		}
	};

	return (
		<Container>
			<ImageContainer
				onClick={(e) => {
					getClickArea(e);
				}}
			>
				<Img src={currentImage.src} alt="" ref={ref}></Img>
				{/* consolidated characterDropdown, characterReveal and userSelection into ImageElements */}
				<ImageElements
					clicksArray={clicksArray}
					isSelectCharacterShown={isSelectCharacterShown}
					currentClickPercentage={currentClickPercentage}
					layoutDispatch={layoutDispatch}
					imageDims={imageDims}
					addClick={addClick}
					currentClickCoords={currentClickCoords}
					currentImage={currentImage}
				/>
			</ImageContainer>
		</Container>
	);
};

export default React.memo(Image);
