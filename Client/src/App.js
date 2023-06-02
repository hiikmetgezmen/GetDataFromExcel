import React, { useState } from "react";
import "./App.css";
import Login from "./login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Weekly from "./Weekly";
import Daily from "./Daily";



function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/Weekly" element={<Weekly></Weekly>}></Route>
      <Route path="/Daily" element={<Daily></Daily>}></Route>


    </Routes>
    </BrowserRouter>
  );
}

export default App;
