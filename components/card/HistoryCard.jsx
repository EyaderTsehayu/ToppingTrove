import Image from "next/image";

const HistoryCard = ({ pizza }) => {
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
          <h1 className="text-3xl  text-lime-600 font-bold">
            {pizza.price}{" "}
            <span className="align-super text-sm font-normal">birr</span>
          </h1>
          {pizza.status == "PREPARING" && (
            <p className="text-primary font-bold text-3xl px-2 py-1 rounded-xl">
              Ordered
            </p>
          )}
          {pizza.status == "READY" && (
            <p className="text-primary font-semibold text-2xl px-2 py-1 rounded-xl">
              Preparing
            </p>
          )}
          {pizza.status == "DELIVERED" && (
            <p className="text-primary font-semibold text-2xl px-2 py-1 rounded-xl">
              Preparing
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
