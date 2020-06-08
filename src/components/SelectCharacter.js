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
}) {
	const characterSelectOptions = [
		{
			name: 'Waldo',
			action: () =>
				userDispatch({
					type: 'select character',
					selection: 'Waldo',
				}),
		},
		{
			name: 'Wizard',
			action: () =>
				userDispatch({
					type: 'select character',
					selection: 'Wizard Whitebeard',
				}),
		},
		{
			name: 'Odlaw',
			action: () =>
				userDispatch({
					type: 'select character',
					selection: 'Odlaw',
				}),
		},
		{
			name: 'Woof',
			action: () =>
				userDispatch({
					type: 'select character',
					selection: 'Woof',
				}),
		},
		{
			name: 'Wendy',
			action: () =>
				userDispatch({
					type: 'select character',
					selection: 'Wendy',
				}),
		},
	];

	const getOffset = () => {
		const obj = {};
		const offsets = {
			right: `calc(${dropdownPosition.x}% + 48px)`,
			left: `calc(${dropdownPosition.x}% - 96px)`,
			up: `calc(${dropdownPosition.y}% - 218px)`,
			down: `calc(${dropdownPosition.y}%)`,
		};

		clickedCoords.x + 108 > window.innerWidth
			? (obj.left = offsets.left)
			: (obj.left = offsets.right);

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
							option.action();
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
