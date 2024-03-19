import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/loggedInContext";
import { auth } from "../../firebase/firebase.js";
import { signOut } from "firebase/auth";

const HomePage = () => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Disconnect Account</button>
    </div>
  );
};

export default HomePage;
