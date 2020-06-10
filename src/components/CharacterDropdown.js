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
	currentClickCoords,
	imageHeight,
	addClick,
}) {
	//TODO - character options should come from userState so that when
	// a character is found, it is removed from the list
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

	console.log(dropdownPosition);

	//off sets the dropdown to remain within the window/image
	const getOffset = () => {
		const obj = {};
		const offsets = {
			right: `calc(${dropdownPosition && dropdownPosition.x}% + 48px)`,
			left: `calc(${dropdownPosition && dropdownPosition.x}% - 96px)`,
			up: `calc(${dropdownPosition && dropdownPosition.y}% - 218px)`,
			down: `calc(${dropdownPosition && dropdownPosition.y}%)`,
		};

		//108 is width of dropdown + selection square
		currentClickCoords.x + 108 > window.innerWidth
			? (obj.left = offsets.left)
			: (obj.left = offsets.right);

		//52 is nav height, 262 is dropdown height
		currentClickCoords.y - 52 + 262 < imageHeight
			? (obj.top = offsets.down)
			: (obj.top = offsets.up);

		return obj;
	};

	return (
		<Container
			x={dropdownPosition && dropdownPosition.x}
			y={dropdownPosition && dropdownPosition.y}
			offsets={getOffset()}
		>
			{characterSelectOptions.map((option, index) => {
				return (
					<SelectionItem
						onClick={(e) => {
							e.stopPropagation();
							addClick(option.name);
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
					layoutDispatch({ type: 'clicked' });
				}}
			>
				<h2>X</h2>
			</CloseDropdown>
		</Container>
	);
}
