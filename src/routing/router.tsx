import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/SignIn";
import LogIn from "../components/LogIn";
import { App } from "../App";
import { ChatApp } from "../components/ChatApp";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "register",
          element: <SignIn />,
        },
        {
          path: "login",
          element: <LogIn />,
        },
        {
          path: "",
          element: <ChatApp />,
        },
      ],
    },
  ],
  {
    basename: "/ws-app-front",
  }
);

