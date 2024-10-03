import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { Divider } from "@mui/material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { PiPackage } from "react-icons/pi";
import { CiPizza } from "react-icons/ci";
import { MdOutlineLogin } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";
import { HiOutlineUser } from "react-icons/hi";
import pizzasidebar from "/public/images/pizzalogin.png";
import { signOut, useSession } from "next-auth/react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // staff approval dropdown
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
  //  staff aproval end
  const [menuItems, setMenuItems] = useState(() => getMenuItems());
  function getMenuItems() {
    // const user = JSON.parse(localStorage.getItem("user"));

    return {
      dashboard: [
        {
          text: <Typography sx={itemTextStyle}>Orders</Typography>,
          icon: <PiPackage style={{ fontSize: "24px", color: "#000" }} />,
          path: "/dashboard/orders",
        },
        {
          text: <Typography sx={itemTextStyle}>Add Menu</Typography>,
          icon: <CiPizza style={{ fontSize: "25px", color: "#000" }} />,
          path: "/dashboard/add-menu",
        },
        {
          text: <Typography sx={itemTextStyle}>Role</Typography>,
          icon: <HiOutlineUser style={{ fontSize: "24px", color: "#000" }} />,
          path: "/dashboard/role",
        },
        {
          text: <Typography sx={itemTextStyle}>User</Typography>,
          icon: <PiUserCircle style={{ fontSize: "25px", color: "#000" }} />,
          path: "/dashboard/user",
        },
      ],
    };
  }
  return (
    <aside
      ref={sidebar}
      className={`fixed top-0 left-0 z-10 h-full  xl:w-2/12  w-64 overflow-y-auto bg-white drop-shadow-lg duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } `}
    >
      <SideBarTitle sx={styledSidebarTitle}>
        <Typography
          variant="p"
          sx={{
            display: "block", //: "none",
            textAlign: "center",
            fontWeight: 500,
            fontSize: "16px",
            color: "#000010",
          }}
        >
          PIZZA
        </Typography>
      </SideBarTitle>

      <button
        ref={trigger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
        className="block lg:hidden"
      >
        <AppRegistrationIcon sx={{ fontSize: "20px", color: "#000" }} />,
      </button>
      <div className="flex items-center justify-center mt-[70px] py-6 bg-[#ff81000d]">
        <Image src={pizzasidebar} width={60} height={60} alt="logo" />
      </div>
      {/* list of admin page */}
      <Box sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {menuItems.dashboard && (
          <List sx={styledList}>
            {menuItems.dashboard.map((item) => (
              <Link href={item.path} key={item.path} style={styledLink}>
                <ListItemButton
                  //onClick={() => handleClick(item.path)}
                  sx={
                    pathname === item.path ? styledActiveButton : styledButton
                  }
                >
                  <StyledIconWrapper>{item.icon}</StyledIconWrapper>
                  {/* <Image src={item.icon} width={20} height={20} alt="logo" /> */}

                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        )}
        <Divider sx={{ mb: "4px" }} />

        <button
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: `${window.location.origin}/sign-in`,
            })
          }
          className="flex gap-2 my-4 px-8 text-lg font-semibold text-orange-600"
        >
          <MdOutlineLogin
            style={{
              fontSize: "26px",
            }}
          />{" "}
          Logout
        </button>
      </Box>
    </aside>
  );
};

export default Sidebar;

const SideBarTitle = styled("div")({
  //isSidebarOpen ?
  display: "flex", //: isSmallScreen ? "none" : "flex",
  position: "fixed",
  alignItems: "center",
  marginTop: "16px",
});

// list item style
const listStyle = {};

// link
const styledLink = {
  textDecoration: "none",
  margin: "0px 0px 4px",
  padding: 0,
};

// button in Link
const styledButton = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  textAlign: "left",
  color: "#000",
  background: "#fff",
  borderRadius: 2,
  height: "46px",
  marginBottom: "3px",

  //isSidebarOpen ?
  padding: "10px 16px 10px 24px", // : "15px",
  "&:hover": {
    background: "#ff810066",
    borderRadius: 2,
    color: "#774FBF",
  },
};

const styledActiveButton = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  textAlign: "left",
  height: "46px",
  //isSidebarOpen ?
  padding: "10px 16px 10px 24px", // : "15px",
  background: "#ff810066",
  borderRadius: 2,
  marginBottom: "3px",
  color: "#5e35b1",
  "&:hover": {
    background: "#ff810066",
    borderRadius: 2,
    color: "#5e35b1",
  },
};

// icon wrapper

const StyledIconWrapper = styled(ListItemIcon)({
  minWidth: "36px",
  height: "10px",
  color: "#000",
  marginBottom: "8px",
});

// image style
const styledImage = {
  height: "50px",
  width: "50px",
  borderRadius: "50%",
  objectFit: "cover",
};
// sidebar title
const styledSidebarTitle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "3px",
  padding: "20px",
  background: "white",
  //height: "83px",
  //width: "228px",
  //margin: "0",
};

// item title
const itemTitleStyle = {
  color: "#4c2894",
  padding: "6px",
  fontWeight: 550,
  fontFamily: "Poppins",
};

const styledList = {
  paddingTop: "0",
  padding: "0",
  paddingBottom: "8px", //: "0px",
};

const itemTextStyle = {
  fontWeight: 500,
  fontSize: "15px",
  color: "#000",
};

// activePage
// activePagestyle
const activePageTitle = {
  fontFamily: "Poppins",
  fontWeight: 500,
  color: "#774FBF",
};
