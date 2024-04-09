import { useNavigate } from "react-router-dom";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { useContext, useEffect, createContext, useState } from "react";
import { signOut } from "firebase/auth";
import { UserContext } from "../../Contexts/loggedInContext";
import { auth } from "../../firebase/firebase.js";
import logo from "../../assets/logo.png";
import profile from "../../assets/profile.png";
const SidebarContext = createContext();

const Navbar = ({ children }) => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <>
      <aside className="h-screen z-50">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
              alt="logo"
            />
            {/*Aici daca apas pe buton face setExpanded pe opus, adica daca e true face false si invers*/}
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <img src={profile} className="w-10 h-10 rounded-md" alt="profile" />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">constGenius</h4>
                <span className="text-xs text-gray-600">
                  constgenius@gmail.com
                </span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
  // Add your comment here
};

//functii de export pentru a le follsii in Navbar din HomePage
export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out!");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
//apelam functia in functie de cum se schimba starea, o apelam in useEffect mai sus
export function SidebarItem({ icon, text, active }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-blue-200 to-orange-300 text-white"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
      s
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}

export default Navbar;
