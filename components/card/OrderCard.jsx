"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const OrderCard = ({ pizza }) => {
  //clg("in order card", pizza.photo);
  // const { name, toppings, price, photo, restaurantName } = pizza;
  const router = useRouter();

  const handleOrderClick = () => {
    const searchParams = new URLSearchParams({
      id: pizza.id,
      name: pizza.name,
      toppings: pizza.toppings,
      price: pizza.price,
      photo: pizza.photo,
      restaurantId: pizza.restaurantId,
      restaurantImage: pizza.restaurantImage,
    }).toString(); // Create a query string

    router.push(`/order/new?${searchParams}`); // Navigate to order page with search params
  };
  return (
    <div
      key={pizza.id}
      className="flex flex-col justify-center pt-4 px-6 items-center rounded-3xl bg-white"
    >
      <div className="flex justify-center pt-4 items-center">
        <Image alt="cards" src={pizza.photo} width={250} height={250} />
      </div>
      <div className="flex flex-col w-72">
        <div className="pb-6">
          <h2 className="text-2xl font-bold text-black">{pizza.name}</h2>
          <p className="text-slate-700">{pizza.toppings}</p>
        </div>
        <div className="flex justify-between items-center text-left gap-4">
          <h1 className="md:text-3xl  font-bold">
            {pizza.price}{" "}
            <span className="align-super text-sm font-semibold">birr</span>
          </h1>
          <button
            onClick={handleOrderClick}
            className="bg-primary font-semibold text-2xl text-mainbg px-2 py-1 rounded-xl"
          >
            Order
          </button>
        </div>
        <hr className="text-sectiontitles my-2 font-bold text-3xl" />
        <div className="flex justify-between items-center pb-4">
          <Image alt="cards" src={pizza.photo} width={50} height={50} />
          <p className="text-base font-bold text-slate-600">
            {pizza.restaurantName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
