import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SentimentPage from "./pages/SentimentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/profile" element={<HomePage />} />
        <Route path="/sentiments/sentiment" element={<SentimentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
