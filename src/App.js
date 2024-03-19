import React from "react";
import LoginPageRoute from "./Routes/loginPage.route";
import HomeRoute from "./Routes/home.routes";
import { UserProvider } from "./Contexts/loggedInContext";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPageRoute />} />
          <Route path="/home" element={<HomeRoute />} />
        </Routes>
      </UserProvider>
    </>
  );
};

export default App;
