import React from "react";
import Registration from "./components/Registration";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
          <Route path="/Registration" element={<Registration />}>
          </Route>
          <Route path="/Login" element={<Login />}>
          </Route>
        </Routes>
      </BrowserRouter>,

    </>
  );
}

export default App;
