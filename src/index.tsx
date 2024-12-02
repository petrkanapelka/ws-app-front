import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { StyledEngineProvider } from '@mui/material/styles';
import ButtonAppBar from './components/MenuAppBar';
import { App } from './App';
import { RouterProvider } from 'react-router-dom';
import { router } from './routing/router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} >
        <StyledEngineProvider injectFirst>
          <ButtonAppBar />
          <App />
        </StyledEngineProvider>
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
