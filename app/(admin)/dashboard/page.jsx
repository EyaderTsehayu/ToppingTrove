import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session inside dashboard", session);
  return (
    <div className="bg-[#f8f8f8] h-screen w-full">
      admin {session?.user.email}
    </div>
  );
};

export default Dashboard;
