"use client";
import Image from "next/image";
// App.js or CarouselComponent.js
import React from "react";
import Carousel from "react-material-ui-carousel";
import pizza1 from "/public/images/carouselpizza1.png";
import pizza2 from "/public/images/carouselpizza2.png";
import pizza3 from "/public/images/carouselpizza3.png";

const items = [
  {
    name: "Random Image 1",
    title: "Make Your First Order and Get",
    subtitle: "50% Off",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate.",
  },
  {
    name: "Random Image 2",
    title: "Make Your First Order and Get",
    subtitle: "50% Off",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate.",
  },
  {
    name: "Random Image 3",
    title: "Make Your First Order and Get",
    subtitle: "50% Off",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate.",
  },
];

function FeaturedPizza() {
  return (
    <Carousel className="bg-mainbg">
      {items.map((item, i) => (
        <CarouselItem className="bg-mainbg" key={i} item={item} />
      ))}
    </Carousel>
  );
}

function CarouselItem({ item }) {
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "rgba(47, 47, 47, 1)";
      case 1:
        return "rgba(80, 72, 43, 1)";
      case 2:
        return "rgba(41, 109, 96, 1)";
      default:
        return "rgba(47, 47, 47, 1)";
    }
  };

  const getImage = (index) => {
    switch (index) {
      case 0:
        return pizza2;
      case 1:
        return pizza3;
      case 2:
        return pizza2;
      default:
        return pizza3;
    }
  };

  return (
    <div className="bg-mainbg ">
      <h2 className="md:pl-40 pl-8 md:mb-6 mb-4 text-2xl font-semibold text-sectiontitles items-center">
        Featured Pizza
      </h2>
      <div className="flex justify-center items-center mb-12">
        <div
          className="flex flex-row justify-between md:w-4/5  mx-4 h-92 rounded-2xl relative"
          style={{ backgroundColor: getBackgroundColor(items.indexOf(item)) }}
        >
          <div className="md:pt-12 md:pl-16 pt-2 pl-4 z-10 w-1/2">
            <h1 className="font-bold  md:text-3xl text-xl md:max-w-[350px] max-w-[200px] text-mainbg mb-2">
              {item.title}
              <span className="text-primary/80"> {item.subtitle}</span>
            </h1>
            <p className="text-mainbg/90 md:text-base text-sm md:mt-4 mt-2 max-w-[420px] ">
              {item.description}
            </p>
            <div>
              <button className="bg-primary font-semibold text-xl text-mainbg mt-4 mb-4 rounded-md md:py-4 md:px-6 py-2 px-4">
                Order Now
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-1/2">
            <Image
              src={getImage(items.indexOf(item))}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedPizza;
