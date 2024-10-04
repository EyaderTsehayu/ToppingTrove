"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/(admin)/dashboard/loading";
import { useSession } from "next-auth/react";
import HistoryCard from "@/components/card/HistoryCard";
import Navbar from "@/components/navbar/Navbar";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const Page = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const loginUserId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = "/api/order/history"; // Base URL
        const fullUrl = `${url}?userId=${encodeURIComponent(loginUserId)}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        const formattedData = data.map((pizza) => ({
          ...pizza,
          photo: pizza.photo,
          // toppings: pizza.toppings.join(", "),
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
    fetchOrders();
  }, [loginUserId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Navbar />
      {pizzaData.length > 0 && (
        <div className="bg-mainbg h-screen md:px-28 px-4">
          <h2 className="mb-4 text-2xl font-semibold text-sectiontitles items-center">
            Order History
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pizzaData.map((pizza) => (
              <HistoryCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </div>
      )}{" "}
      {pizzaData.length === 0 && (
        <div className="bg-mainbg h-screen  flex justify-center items-center md:px-28 px-4">
          <h2 className="mb-4 md:text-4xl text-2xl font-semibold text-center text-primary">
            You don't have any order history!
          </h2>
        </div>
      )}
    </div>
  );
};

export default Page;
