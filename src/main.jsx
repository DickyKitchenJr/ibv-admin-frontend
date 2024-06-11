import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import AuthProvider from "./context/AuthProvider.jsx";
import Login from "./pages/Login.jsx";
import Welcome from "./pages/Welcome.jsx";
import ProcessNewAuthors from "./pages/ProcessNewAuthors.jsx";
import ModifyListing from "./pages/ModifyListing.jsx";
import VerifyListing from "./pages/VerifyListing.jsx";
import DeleteAuthors from "./pages/DeleteAuthors.jsx";
import AddUsers from "./pages/AddUsers.jsx";
import AllAuthors from "./pages/AllAuthors.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "welcome",
    element: <Welcome />,
  },
  {
    path: "addauthors",
    element: <ProcessNewAuthors />,
  },
  {
    path: "modify",
    element: <ModifyListing />,
  },
  {
    path: "verify",
    element: <VerifyListing />,
  },
  {
    path: "delete",
    element: <DeleteAuthors />,
  },
  {
    path: "addusers",
    element: <AddUsers />,
  },
  {
    path: "allauthors",
    element: <AllAuthors />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
