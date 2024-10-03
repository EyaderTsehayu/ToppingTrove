//import { useAbility } from "@/context/AbilityContext";
import { defineAbilitiesFor } from "@/lib/ability";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session inside dashboard", session);
  const ability = defineAbilitiesFor(session.user);
  // const ability = useAbility();
  return (
    <div className="bg-[#f8f8f8] h-screen w-full">
      admin {session?.user.email}
      <br />
      {ability.can("read", "Order") && (
        <button className="bg-primary text-white"> let us do it</button>
      )}
    </div>
  );
};

export default Dashboard;
