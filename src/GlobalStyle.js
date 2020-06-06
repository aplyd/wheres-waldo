import styled, { createGlobalStyle, css } from 'styled-components';

export const Spacer = styled.div`
	height: ${(props) => `var(--spacing-${props.height})`};
	width: ${(props) => `var(--spacing-${props.width})`};
	pointer-events: none;
`;

export const GlobalStyle = createGlobalStyle`
    ::root {
        --spacing-xs: 8px;
        --spacing-s: 16px;
        --spacing-m: 32px;
        --spacing-l: 64px;
        --spacing-xl: 128px;
        --spacing-xxl: 256px;
    }

    button {
        cursor: pointer;
    }
`;
