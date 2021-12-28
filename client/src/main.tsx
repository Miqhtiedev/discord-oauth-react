import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import "./tailwind.css";
import Profile from "./Pages/Profile";
import { createGlobalState } from "react-hooks-global-state";

interface IGlobalState {
  error: string;
}

const initalState = { error: "" };

export const { useGlobalState } = createGlobalState<IGlobalState>(initalState);

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Error />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
