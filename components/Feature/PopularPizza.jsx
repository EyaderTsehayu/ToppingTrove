import pizzaorder from "/public/images/pizzaorder.png";
import resprofile from "/public/images/resprofile.png";
import OrderCard from "../card/OrderCard";

const PopularPizza = () => {
  const pizzaData = [
    {
      id: 1,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    {
      id: 2,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    {
      id: 3,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    {
      id: 4,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    {
      id: 5,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    {
      id: 6,
      name: "Margherita",
      ingredients: "Tomato, Mozzarella, Bell Peppers, Onions, Olives",
      price: 150,
      image: pizzaorder,
      restaurant: "Azmera Pizza",
      restaurantImage: resprofile,
    },
    // Add more pizza data objects here if needed
  ];

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
