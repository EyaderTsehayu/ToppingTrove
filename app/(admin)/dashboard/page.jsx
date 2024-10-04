//import { useAbility } from "@/context/AbilityContext";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Loading from "./loading";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    const resId = session?.user?.restaurantId;
    // console.log("REstaurant IDDddddd", resId);
    if (resId != null) {
      redirect("/dashboard/orders");
    } else {
      redirect("/order");
    }
  }

  return (
    <div className="bg-[#f8f8f8] h-screen w-full">
      <Loading />
      <br />
    </div>
  );
};

export default Dashboard;
