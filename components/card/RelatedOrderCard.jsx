import Image from "next/image";
import React from "react";

const RelatedOrderCard = ({ pizza }) => {
  return (
    <div
      key={pizza.id}
      className="flex flex-col justify-center pt-4 px-6 items-center rounded-3xl bg-white"
    >
      <div className="flex justify-center pt-4 items-center">
        <Image alt="cards" src={pizza.image} width={250} height={250} />
      </div>
      <div className="flex flex-col w-72">
        <div className="pb-6">
          <h2 className="text-2xl font-bold text-center text-black">
            {pizza.name}
          </h2>
          <p className="text-slate-700 text-center">{pizza.ingredients}</p>
        </div>
      </div>
    </div>
  );
};

export default RelatedOrderCard;
