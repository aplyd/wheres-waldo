import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';

const Container = styled.div`
	width: 100%;
	height: calc(100vh - 52px);
	top: 52px;
	position: absolute;
	background-color: black;
	z-index: 1004;
`;

const Content = styled.div`
	max-width: 800px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;

	&& > p {
		color: white;
		padding-top: 24px;
	}

	&& a,
	a[visited] {
		color: blue;
	}
`;

export default function About({ layoutDispatch }) {
	return (
		<>
			<Nav layoutDispatch={layoutDispatch} />
			<Container>
				<Content>
					<p>
						Created by Austin Ftacnik as part of{' '}
						<a href="https://www.theodinproject.com/lessons/where-s-waldo-a-photo-tagging-app-javascript">
							The Odin Project{' '}
						</a>
						curriculum.
					</p>
					<p>
						The code can be seen{' '}
						<a href="https://github.com/aplyd/wheres-waldo">here</a>
						.
					</p>
				</Content>
			</Container>
		</>
	);
}

About.propTypes = {
	layoutDispatch: PropTypes.func,
};
