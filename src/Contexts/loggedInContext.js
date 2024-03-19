import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);
  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};
