import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import * as consts from '../constants';

const Container = styled.div`
	position: absolute;
	left: ${(props) => props.offsets.left};
	top: ${(props) => `calc(${props.offsets.top} + ${props.windowScrollY}px)`};
	background-color: white;
	border-radius: 8px;
	&& > div:first-child {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}
	&& > div:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}
`;

const SelectionItem = styled.div`
	cursor: pointer;
	text-align: center;
	&&:hover {
		color: white;
		background-color: black;
	}
	&& > h2 {
		font-size: 20px;
		padding: 10px 14px;
		text-transform: capitalize;
	}
`;

const CloseDropdown = styled(SelectionItem)`
	background-color: black;
	color: white;
	&&:hover {
		color: black;
		background-color: white;
	}
	text-align: center;
`;

function CharacterDropdown({
	currentClickPercentage,
	layoutDispatch,
	imageHeight,
	addClick,
	images,
	currentClickCoords,
	currentImage,
}) {
	const charactersRemaining = Object.values(currentImage).filter((char) => {
		return char.hasOwnProperty('found') && !char.found && char;
	});

	// off sets the dropdown to remain within the window/image
	const getOffset = () => {
		const obj = {};
		// when a character is found, it is removed from dropdown, this ensures placement
		const charOffset = charactersRemaining.length * 43;
		const offsets = {
			right: `calc(${
				currentClickPercentage && currentClickPercentage.x
			}% + 48px)`,
			left: `calc(${
				currentClickPercentage && currentClickPercentage.x
			}% - 96px)`,
			up: `calc(${
				currentClickPercentage && currentClickPercentage.y
			}% - ${charOffset}px)`,
			down: `calc(${
				currentClickPercentage && currentClickPercentage.y
			}%)`,
		};

		// 108 is width of dropdown + selection square
		currentClickCoords.x + 108 > window.innerWidth
			? (obj.left = offsets.left)
			: (obj.left = offsets.right);

		// 52 is nav height, 262 is dropdown height, add scroll offset amount
		currentClickCoords.y - 52 + 262 < window.innerHeight
			? (obj.top = offsets.down)
			: (obj.top = offsets.up);

		return obj;
	};

	return (
		<Container
			x={currentClickPercentage && currentClickPercentage.x}
			y={currentClickPercentage && currentClickPercentage.y}
			windowScrollX={currentClickPercentage.windowScrollX}
			windowScrollY={currentClickPercentage.windowScrollY}
			offsets={getOffset()}
		>
			{charactersRemaining.map((char, index) => {
				return (
					<SelectionItem
						onClick={(e) => {
							e.stopPropagation();
							addClick(char.name);
						}}
						key={`${char.name}`}
					>
						<h2>{char.name}</h2>
					</SelectionItem>
				);
			})}
			<CloseDropdown
				onClick={(e) => {
					e.stopPropagation();
					layoutDispatch({ type: consts.CLICKED });
				}}
			>
				<h2>X</h2>
			</CloseDropdown>
		</Container>
	);
}

CharacterDropdown.propTypes = {
	addClick: PropTypes.func,
	currentClickPercentage: PropTypes.shape({
		x: PropTypes.any,
		y: PropTypes.any,
	}),
	imageHeight: PropTypes.any,
	layoutDispatch: PropTypes.func,
	layoutState: PropTypes.shape({
		currentClickCoords: PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number,
		}),
		currentClickPercentage: PropTypes.shape({
			windowScrollX: PropTypes.any,
			windowScrollY: PropTypes.any,
		}),
		currentImageIndex: PropTypes.any,
		images: PropTypes.any,
	}),
};

export default React.memo(CharacterDropdown);
