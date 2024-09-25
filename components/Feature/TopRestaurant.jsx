import React from "react";
import TopResCard from "../card/TopResCard";
const restaurants = [
  {
    id: 1,
    name: "Azmera Pizza",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder ...",
  },
  {
    id: 2,
    name: "Azmera Pizza",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to...",
  },
  {
    id: 3,
    name: "Azmera Pizza",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to...",
  },
  {
    id: 4,
    name: "Azmera Pizza",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to...",
  },
  {
    id: 5,
    name: "Azmera Pizza",
    description:
      "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to...",
  },
];

const TopRestaurant = () => {
  return (
    <div className="bg-gradient-to-b from-white via-[#ffc993] to-[#fff8f1]">
      <h2 className="md:pl-28 pl-8 pt-12 mb-4 text-2xl font-semibold text-sectiontitles items-center">
        Top Restaurants
      </h2>
      <div className="flex md:px-28 pb-12 px-8 overflow-x-auto remove-scrollbar gap-6">
        <div className="flex gap-6">
          {restaurants.map((restaurant) => (
            <TopResCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRestaurant;
