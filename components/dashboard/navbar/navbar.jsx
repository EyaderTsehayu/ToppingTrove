// import Link from "next/link";

// import DropdownUser from "./DropdownUser";
// import Image from "next/image";

import { usePathname } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
// import iconNotification from "/public/icons/iconNotification.svg";
// import iconProfile from "/public/icons/iconProfile.svg";
// import pizzasidebar from "/public/images/pizzalogin.png";

const Navbar = (props) => {
  const pathname = usePathname();

  // on hover
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null); // Create a ref for the dropdown element

  const handleDropdownItemClick = (page) => {
    // Navigate to the selected page here
    // You can use React Router, window.location.href, or any other navigation method
    // For example, if you are using React Router, you can use history.push('/your-page')
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown if the click is outside the dropdown
      setShowDropdown(false);
    } else if (!dropdownRef.current.contains(event.relatedTarget)) {
      // Close the dropdown if the mouse leaves the dropdown and doesn't hover over the dropdown button
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown if the click is outside the dropdown
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex w-full bg-white drop-shadow-lg">
      <div className="flex flex-grow items-center justify-between px-4 py-2 md:py-6 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}

          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            // className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <MenuIcon sx={{ fontSize: "24px", color: "#5e35b1" }} />
          </button>

          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <div className="hidden lg:block "></div>
        <div className="flex items-center gap-3 2xsm:gap-7 ">
          <ul className="flex items-center gap-4 2xsm:gap-4"></ul>
          <IoMdNotificationsOutline
            style={{ fontSize: "24px", color: "#000" }}
          />
          <CgProfile style={{ fontSize: "24px", color: "#000" }} />
          {/* <!-- User Area --> */}
          {/* <DropdownUser /> */}
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
