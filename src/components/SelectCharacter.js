import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: absolute;
	left: ${(props) => props.offsets.left};
	top: ${(props) => props.offsets.top};
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
	background-color: red;
	color: white;
	&&:hover {
		color: black;
		background-color: white;
	}
	text-align: center;
`;

export default function SelectCharacter({
	dropdownPosition,
	userDispatch,
	layoutDispatch,
	clickedCoords,
	imageHeight,
	checkUserSelection,
}) {
	const characterSelectOptions = [
		{
			name: 'waldo',
		},
		{
			name: 'wizard',
		},
		{
			name: 'odlaw',
		},
		{
			name: 'woof',
		},
		{
			name: 'wendy',
		},
	];

	//off sets the dropdown to remain within the window/image
	const getOffset = () => {
		const obj = {};
		const offsets = {
			right: `calc(${dropdownPosition.x}% + 48px)`,
			left: `calc(${dropdownPosition.x}% - 96px)`,
			up: `calc(${dropdownPosition.y}% - 218px)`,
			down: `calc(${dropdownPosition.y}%)`,
		};

		//108 is width of dropdown + selection square
		clickedCoords.x + 108 > window.innerWidth
			? (obj.left = offsets.left)
			: (obj.left = offsets.right);

		//52 is nav height, 262 is dropdown height
		clickedCoords.y - 52 + 262 < imageHeight
			? (obj.top = offsets.down)
			: (obj.top = offsets.up);

		return obj;
	};

	return (
		<Container
			x={dropdownPosition.x}
			y={dropdownPosition.y}
			offsets={getOffset()}
		>
			{characterSelectOptions.map((option, index) => {
				return (
					<SelectionItem
						onClick={(e) => {
							e.stopPropagation();
							checkUserSelection(option.name);
						}}
						key={index}
					>
						<h2>{option.name}</h2>
					</SelectionItem>
				);
			})}
			<CloseDropdown
				onClick={(e) => {
					e.stopPropagation();
					layoutDispatch({ type: 'close character selection' });
				}}
			>
				<h2>X</h2>
			</CloseDropdown>
		</Container>
	);
}
