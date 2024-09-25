import React from "react";
import searchIcon from "/public/images/search.png";
import heropizza from "/public/images/hero-1.png";
import heroleaf1 from "/public/images/hero-2.png";
import heroleaf2 from "/public/images/hero-3.png";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="overflow-hidden">
      <div>
        <div className="flex md:flex-row">
          <div className="lg:max-w-[766px] md:max-w-[450px] max-w-[280px] lg:pl-28 px-4 lg:px-0">
            <h1 className="font-bold lg:leading-[225px] text-5xl md:text-7xl lg:text-9xl bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
              Order us
            </h1>
            <p className=" font-normal text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed lg:leading-[36.17px] mt-4 lg:mt-0">
              In publishing and graphic design, Lorem ipsum is a placeholder
              text commonly used to demonstrate the visual form of a document or
              a typeface without.
            </p>
            <div className="flex mt-8 items-center bg-white border rounded-full">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 p-1 h-12 md:h-14 lg:h-16 lg:pl-8 lg:text-xl placeholder-black rounded-full text-gray-900 outline-none"
              />
              <button className="flex justify-center items-center p-2 bg-orange-400 h-12 md:h-14 lg:h-16 w-12 md:w-14 lg:w-16 m-1 rounded-full text-gray-700">
                <Image src={searchIcon} alt="search" width={25} height={25} />
              </button>
            </div>
          </div>
          <div className="relative w-full  md:h-auto flex justify-end">
            <div className="relative w-[180px] h-[350px] md:w-[200px] md:h-[380px] lg:w-[320px] lg:h-[650px]">
              <Image
                src={heroleaf1}
                alt="Leaf-1 hero"
                className="absolute md:w-40 md:h-40 h-24 w-24 lg:right-52 right-28 object-cover"
              />
              <Image
                src={heropizza}
                alt="pizza hero"
                objectFit="cover"
                fill
                className="w-full z-10 h-full top-0 right-0 object-cover"
              />
              <Image
                src={heroleaf2}
                alt="Leaf-2 hero"
                className="absolute z-0 lg:w-40 lg:h-40 h-20 w-20 lg:top-96 top-56 lg:right-60 right-32 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
