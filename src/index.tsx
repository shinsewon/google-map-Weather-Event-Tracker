import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from 'styles';
import { ContextProvider } from 'context';

import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <ContextProvider>
      <App />
    </ContextProvider>
  </ThemeProvider>,

  document.getElementById('root'),
);
