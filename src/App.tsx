import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppProvider  from './hooks/index';
import Routes from './routes/index';

import GlobalStyle from './styles/global';

const App: React.FC = () => (
    <>
      <AppProvider>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </AppProvider>
      <GlobalStyle />
    </>
  );

export default App;
