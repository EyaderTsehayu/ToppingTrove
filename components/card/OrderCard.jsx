import Image from "next/image";
import React from "react";

const OrderCard = ({ pizza }) => {
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
          <h2 className="text-2xl font-bold text-black">{pizza.name}</h2>
          <p className="text-slate-700">{pizza.ingredients}</p>
        </div>
        <div className="flex text-left gap-4">
          <h1 className="text-3xl font-bold">
            {pizza.price}{" "}
            <span className="align-super text-sm font-semibold">birr</span>
          </h1>
          <button className="bg-primary font-semibold text-2xl text-mainbg px-2 py-1 rounded-xl">
            Order
          </button>
        </div>
        <hr className="text-sectiontitles my-2 font-bold text-3xl" />
        <div className="flex justify-between items-center pb-4">
          <Image
            alt="cards"
            src={pizza.restaurantImage}
            width={50}
            height={50}
          />
          <p className="text-base font-bold text-slate-600">
            {pizza.restaurant}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
