import React from "react";
import searchIcon from "/public/images/search.png";
import logo from "/public/images/logo.png";
import send from "/public/images/send.png";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="felx">
      <div className="flex items-center  justify-between bg-footerbg md:px-28 px-8 py-4 md:py-16">
        <div className="flex md:flex-row flex-col w-1/2 md:gap-16 gap-2 text-black font-semibold md:text-2xl text-base">
          <p>Home</p>
          <p>Order</p>
          <p>About Us</p>
        </div>
        <div className="flex flex-col  gap-3  ">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src={logo}
              alt="logo"
              // objectFit="cover"
              width={80}
              height={30}
              // className="w-full z-10 h-full top-0 right-0 object-cover "
            />
          </div>
          <div className="flex md:w-96 md:py-1 items-center justify-center bg-white border rounded-md">
            <input
              type="text"
              placeholder="Your Feedback"
              className="flex-1 py-3 px-6  text-base  text-light placeholder-gray-500 rounded-full text-black outline-none"
            />
            <button className=" md:mr-4">
              <Image src={send} alt="search" width={30} height={30} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-black flex md:flex-row flex-col gap-4  items-center justify-between md:px-28 py-10 px-8 ">
        <div className="text-white flex md:flex-row flex-col gap-2 font-light md:text-xl text-base items-center justify-center">
          <p>@2024 Pizza All Rights Reserved.</p>
          <p>Terms & Conditions</p>
        </div>
        <div className="text-white flex justify-center items-center gap-3">
          <div className="bg-gray-900  px-4 py-4 rounded-full">
            <FaFacebookF size={22} />
          </div>
          <div className="bg-gray-900 px-4 py-4 rounded-full">
            <FaLinkedinIn size={22} />
          </div>{" "}
          <div className="bg-gray-900 px-4 py-4 rounded-full">
            <FaTwitter size={22} />
          </div>{" "}
          <div className="bg-gray-900 px-4 py-4 rounded-full">
            <FaYoutube size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
