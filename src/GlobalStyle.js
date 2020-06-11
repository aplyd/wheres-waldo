import styled, { createGlobalStyle, css } from 'styled-components';

export const Spacer = styled.div`
	height: ${(props) => props.height};
	width: ${(props) => props.width};
	pointer-events: none;
`;

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    #root, body {
        background-color: black;
    }

    button {
        cursor: pointer;
    }
`;
