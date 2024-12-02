import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from '../App';
import SignIn from "../components/SignIn";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/register',
    element: <SignIn />,
  },
],
  {
    basename: "/ws-app-front",
  }
);


