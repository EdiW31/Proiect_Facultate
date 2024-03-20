import Navbar, { SidebarItem } from "../Navbar/navbar.component";
import { LayoutDashboard, Home, Plus, LogOut } from "lucide-react";
import { handleLogout } from "../Navbar/navbar.component";

const HomePage = () => {
  return (
    <>
      <div className="flex">
        {/* Sidebar Navigation*/}
        <Navbar>
          <SidebarItem icon={<Home size={20} />} text="Home" />
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            active
          />
          <SidebarItem icon={<Plus size={20} />} text="Add New" />
          <hr className="my-2" />
          <button onClick={handleLogout}>
            <SidebarItem icon={<LogOut size={20} />} text="Log Out" />
          </button>
        </Navbar>
        {/* Sfarsitul navbarului*/}
        {/* Main Content*/}
      </div>
    </>
  );
};

export default HomePage;
