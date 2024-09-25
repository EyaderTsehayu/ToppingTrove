import Image from "next/image";
import pizzaregistration from "/public/images/pizzaregistration.png";
const SideUi = () => {
  return (
    <div className="hidden md:flex w-1/2 justify-center items-center bg-primary">
      <div>
        <Image
          src={pizzaregistration}
          height={305}
          width={300}
          alt="pizza"
          className=""
        />
      </div>
    </div>
  );
};

export default SideUi;
