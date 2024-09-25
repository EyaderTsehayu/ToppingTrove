import pizzaorder from "/public/images/pizzaorder.png";
import resprofile from "/public/images/resprofile.png";
import OrderCard from "../card/OrderCard";

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
const Fasting = () => {
  return (
    <div className="bg-mainbg  py-12 md:px-28 px-4">
      <h2 className="mb-4 text-2xl font-semibold text-sectiontitles items-center">
        Fasting
      </h2>
      <div className="flex  overflow-x-auto remove-scrollbar ">
        <div className="flex gap-6">
          {pizzaData.map((pizza) => (
            <OrderCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fasting;
