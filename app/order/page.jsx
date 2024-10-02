// pages/order/[id]/index.js
"use client";

import { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";
import { PiArrowUpRightBold } from "react-icons/pi";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import pizza from "/public/images/pizzaorder.png";
import RelatedOrderCard from "@/components/card/RelatedOrderCard";
import { useSession } from "next-auth/react";

const OrderPage = () => {
  const searchParams = useSearchParams(); // Hook to get search params from the URL
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const toppings = searchParams.get("toppings");
  const price = searchParams.get("price");
  const photo = searchParams.get("photo");
  const restaurantId = searchParams.get("restaurantId");

  const pricePerPizza = parseFloat(price) || 0;
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user.id;
  useEffect(() => {
    if (toppings) {
      setSelectedToppings(toppings.split(", "));
    }
  }, [toppings]);

  const handleToppingChange = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((item) => item !== topping)
        : [...prev, topping]
    );
  };

  // const handleSubmi = (e) => {
  //   e.preventDefault();
  //   const orderData = {
  //     id,
  //     name,
  //     toppings: selectedToppings,
  //     quantity,
  //     totalPrice: quantity * pricePerPizza,
  //     restaurantId: restaurantId,
  //     userId: userId,
  //   };
  //   console.log("order data from new order page", orderData);
  //   // Handle orderData (e.g., send to backend)
  // };
  const handleSubmit = async (data) => {
    try {
      const response = await fetch("/api/order/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toppings: selectedToppings,
          quantity: quantity,
          menuId: parseInt(id),
          restaurantId: parseInt(restaurantId),
          userId: parseInt(userId),
        }),
      });

      if (response.ok) {
        setUploadSuccess(true); // Set success to true if response is OK
        console.log("Order added successfully");
      } else {
        console.log("Order adding failed");
      }
    } catch (error) {
      console.error("Something went wrong");
    }
  };

  // if (!id) {
  //   return <p>Loading...</p>;
  // }
  const pizzaData = [
    {
      id: 1,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    {
      id: 2,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    {
      id: 3,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    {
      id: 4,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    {
      id: 5,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    {
      id: 6,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      image: pizza,
    },
    // Add more pizza data objects here if needed
  ];
  return (
    <div>
      {id && (
        <div className="flex flex-col gap-10 bg-mainbg md:px-32 md:py-16">
          <div className="flex flex-col md:flex-row  md:gap-24 gap-6 px-6 py-4">
            <div className="flex  gap-4">
              <Image
                src={photo}
                alt="pizza"
                layout="responsive"
                width={500}
                height={500}
              />
              <div className="flex flex-col md:gap-6 gap-2">
                <Image
                  src={photo}
                  alt="pizza"
                  layout="responsive"
                  width={208}
                  height={208}
                />
                <Image
                  src={photo}
                  alt="pizza"
                  layout="responsive"
                  width={208}
                  height={208}
                />
              </div>
            </div>
            <div>
              <h1 className="md:text-6xl text-3xl font-bold">{name}</h1>
              <p>{toppings}</p>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    {toppings.split(", ").map((topping) => (
                      <FormControlLabel
                        key={topping}
                        control={
                          <Checkbox
                            checked={selectedToppings.includes(topping)}
                            onChange={() => handleToppingChange(topping)}
                            sx={{
                              color: "#FFA500",
                              "&.Mui-checked": { color: "#FFA500" },
                            }}
                          />
                        }
                        label={topping}
                      />
                    ))}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-white text-black font-bold px-4 py-3 border-2 rounded-xl border-primary"
                    >
                      <FaMinus size={20} />
                    </button>
                    <span className="text-3xl font-medium mx-8">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-white text-black font-bold px-4 py-3 border-2 rounded-xl border-primary"
                    >
                      <FaPlus size={20} />
                    </button>
                    <span className="text-footerbg font-bold text-5xl ml-8">
                      {quantity * pricePerPizza}{" "}
                      <span className="align-super text-black text-base font-normal">
                        Birr
                      </span>
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="flex justify-between items-center bg-primary text-white font-bold text-2xl w-full rounded-lg py-4 px-4 mt-4"
                  >
                    Order
                    <PiArrowUpRightBold size={30} />
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div>
            <h2 className="mb-4 pl-4 text-2xl font-bold text-sectiontitles items-center">
              Related
            </h2>
            <div className="flex pl-4 overflow-x-auto remove-scrollbar ">
              <div className="flex gap-6">
                {pizzaData.map((pizza) => (
                  <RelatedOrderCard key={pizza.id} pizza={pizza} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {!uploadSuccess && !id && <p>Loading... </p>} */}
      {!id && ( // Conditionally render the success message
        <p className="text-green-500 text-lg font-semibold mt-4">
          Order successfully uploaded!
        </p>
      )}
    </div>
  );
};

export default OrderPage;

// "use client";
// import Image from "next/image";
// import pizza from "/public/images/pizzaorder.png";
// import { useForm, Controller } from "react-hook-form";
// import { useState } from "react";
// import { Checkbox, FormControlLabel } from "@mui/material";
// import { FaMinus, FaPlus } from "react-icons/fa";
// import { PiArrowUpRightBold } from "react-icons/pi";
// import OrderCard from "@/components/card/OrderCard";
// import RelatedOrderCard from "@/components/card/RelatedOrderCard";
// const page = () => {
//   const toppings = ["Pepperoni", "Mushrooms", "Onions", "Sausage", "Bacon"];
//   const pricePerPizza = 10;

//   const { handleSubmit, control } = useForm();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedToppings, setSelectedToppings] = useState([]);

//   const handleToppingChange = (topping) => {
//     setSelectedToppings((prev) =>
//       prev.includes(topping)
//         ? prev.filter((item) => item !== topping)
//         : [...prev, topping]
//     );
//   };

//   const onSubmit = (data) => {
//     const orderData = {
//       //   ...data,
//       toppings: selectedToppings,
//       quantity,
//       totalPrice: quantity * pricePerPizza,
//     };
//     console.log(orderData);
//   };
//   const pizzaData = [
//     {
//       id: 1,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     {
//       id: 2,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     {
//       id: 3,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     {
//       id: 4,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     {
//       id: 5,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     {
//       id: 6,
//       name: "Margherita",
//       ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
//       image: pizza,
//     },
//     // Add more pizza data objects here if needed
//   ];
//   return (
//     <div className="flex flex-col gap-10 bg-mainbg  md:px-32 md:py-16  ">
//       <div className="flex flex-col md:flex-row items-center md:gap-24 gap-6 px-4 py-4">
//         <div className="flex gap-4">
//           <Image
//             src={pizza}
//             alt="pizza"
//             layout="responsive"
//             width={500}
//             height={500}
//           />
//           <div className="flex flex-col md:gap-6 gap-2">
//             <Image
//               src={pizza}
//               alt="pizza"
//               layout="responsive"
//               width={208}
//               height={208}
//             />
//             <Image
//               src={pizza}
//               alt="pizza"
//               layout="responsive"
//               width={208}
//               height={208}
//             />
//           </div>
//         </div>
//         <div>
//           <h1 className="md:text-6xl text-3xl  font-bold text-left md:mb-8 mb-4 md:leading-10">
//             Margherita
//           </h1>
//           <div>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="mb-4 grid grid-cols-3 gap-4">
//                 {toppings.map((topping) => (
//                   <div key={topping}>
//                     <FormControlLabel
//                       control={
//                         <Controller
//                           name={topping}
//                           control={control}
//                           render={({ field }) => (
//                             <Checkbox
//                               {...field}
//                               checked={selectedToppings.includes(topping)}
//                               onChange={() => handleToppingChange(topping)}
//                               sx={{
//                                 color: "#FFA500",
//                                 "&.Mui-checked": {
//                                   color: "#FFA500",
//                                 },
//                               }}
//                             />
//                           )}
//                         />
//                       }
//                       label={topping}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center">
//                 <button
//                   className="bg-white text-black font-bold  px-4 py-3 border-2 rounded-xl border-primary"
//                   type="button"
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                 >
//                   <FaMinus size={20} />
//                 </button>
//                 <span className="text-3xl font-medium mx-8">{quantity}</span>
//                 <button
//                   className="bg-white text-black font-bold  px-4 py-3 border-2 rounded-xl border-primary"
//                   type="button"
//                   onClick={() => setQuantity((q) => q + 1)}
//                 >
//                   <FaPlus size={20} />
//                 </button>
//                 <span className="text-footerbg font-bold text-5xl  ml-8 ">
//                   {quantity * pricePerPizza}{" "}
//                   <span className="align-super text-black text-base font-normal">
//                     Birr
//                   </span>
//                 </span>
//               </div>
//               <button
//                 type="submit"
//                 className="flex justify-between items-center bg-primary text-white font-bold text-2xl w-full rounded-lg py-4 px-4 mt-4"
//               >
//                 Order
//                 <PiArrowUpRightBold size={30} />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <div>
//         <h2 className="mb-4 pl-4 text-2xl font-bold text-sectiontitles items-center">
//           Related
//         </h2>
//         <div className="flex pl-4 overflow-x-auto remove-scrollbar ">
//           <div className="flex gap-6">
//             {pizzaData.map((pizza) => (
//               <RelatedOrderCard key={pizza.id} pizza={pizza} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;