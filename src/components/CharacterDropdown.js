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

export default function CharacterDropdown({
	dropdownPosition,
	layoutDispatch,
	imageHeight,
	addClick,
	layoutState,
}) {
	const charactersRemaining = Object.values(
		layoutState[layoutState.images[layoutState.currentImageIndex].string]
	).filter((char) => {
		return !char.found && char;
	});

	//off sets the dropdown to remain within the window/image
	const getOffset = () => {
		const obj = {};
		//when a character is found, it is removed from dropdown, this ensures placement
		const charOffset = charactersRemaining.length * 43;
		const offsets = {
			right: `calc(${dropdownPosition && dropdownPosition.x}% + 48px)`,
			left: `calc(${dropdownPosition && dropdownPosition.x}% - 96px)`,
			up: `calc(${
				dropdownPosition && dropdownPosition.y
			}% - ${charOffset}px)`,
			down: `calc(${dropdownPosition && dropdownPosition.y}%)`,
		};

		//108 is width of dropdown + selection square
		layoutState.currentClickCoords.x + 108 > window.innerWidth
			? (obj.left = offsets.left)
			: (obj.left = offsets.right);

		//52 is nav height, 262 is dropdown height
		layoutState.currentClickCoords.y - 52 + 262 < imageHeight
			? (obj.top = offsets.down)
			: (obj.top = offsets.up);

		return obj;
	};

	return (
		<Container
			x={dropdownPosition && dropdownPosition.x}
			y={dropdownPosition && dropdownPosition.y}
			windowScrollX={layoutState.currentClickPercentage.windowScrollX}
			windowScrollY={layoutState.currentClickPercentage.windowScrollY}
			offsets={getOffset()}
		>
			{charactersRemaining.map((char, index) => {
				return (
					<SelectionItem
						onClick={(e) => {
							e.stopPropagation();
							addClick(char.name);
						}}
						key={index}
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
	dropdownPosition: PropTypes.shape({
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
