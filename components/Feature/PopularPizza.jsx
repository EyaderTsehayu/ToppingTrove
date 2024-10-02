"use client";
import pizzaorder from "/public/images/pizzaorder.png";
import resprofile from "/public/images/resprofile.png";
import OrderCard from "../card/OrderCard";
import { useEffect, useState } from "react";
import Loading from "@/app/(admin)/dashboard/loading";

const PopularPizza = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const data = await response.json();
        const formattedData = data.map((pizza) => ({
          ...pizza,
          photo: pizza.photo,
          toppings: pizza.toppings.join(", "),
          // logo: pizza.logo,
        }));
        console.log("formatted data in the home", formattedData);
        setPizzaData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pizza data:", error);
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="bg-mainbg md:px-28 px-4">
      <h2 className="mb-4 text-2xl font-semibold text-sectiontitles items-center">
        Popular Pizza
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {pizzaData.map((pizza) => (
          <OrderCard key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
};

export default PopularPizza;
