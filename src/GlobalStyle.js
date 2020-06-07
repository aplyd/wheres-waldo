import styled, { createGlobalStyle, css } from 'styled-components';

export const Spacer = styled.div`
	height: ${(props) => props.height};
	width: ${(props) => props.width};
	pointer-events: none;
`;

export const GlobalStyle = createGlobalStyle`
    ::root {
      
    }

    button {
        cursor: pointer;
    }
`;
