import Image from "next/image";
import React from "react";

import resprofile from "/public/images/resprofile.png";
import fullycharged from "/public/images/fullycharged.png";
import circlebg from "/public/images/circlebg.png";

const TopResCard = ({ restaurant }) => {
  return (
    <div className="flex  md:w-[550px] mh-[150px] w-[750px]  gap-2 flex-row rounded-xl md:py-6 md:px-8 py-2 px-4 bg-mainbg">
      <div className="flex flex-col w-1/2">
        <div className="flex flex-row items-center gap-4">
          <Image
            src={resprofile}
            alt="restaurant profile"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h2 className="text-base font-semibold">{restaurant.name}</h2>
        </div>
        <div className="items-center justify-center text-sectiontitles">
          <p>{restaurant.description}</p>
        </div>
      </div>

      <div className="flex flex-row w-1/2 items-center justify-center bg-topcardbg rounded-xl">
        <div className="relative">
          <Image
            src={circlebg}
            alt="circle bg"
            width={80}
            height={80}
            className="rounded-full"
          />
          <Image
            src={fullycharged}
            alt="fully charged"
            width={40}
            height={50}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex flex-col justify-center items-center ml-4">
          <p className="text-sm text-sectiontitles">Number of orders</p>
          <h1 className="font-bold text-4xl">2K</h1>
        </div>
      </div>
    </div>
  );
};

export default TopResCard;
