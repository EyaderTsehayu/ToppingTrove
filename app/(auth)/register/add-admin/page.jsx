import Image from "next/image";
import logo from "/public/images/logo.png";
import SideUi from "@/components/ui/SideUi";
import AddAdminForm from "@/components/forms/AddAdminForm";

const page = () => {
  return (
    <div className="flex h-screen">
      <SideUi />

      <section className="remove-scrollbar container my-auto w-full md:w-1/2">
        <div className="sub-container max-w-[496px]">
          <Image
            src={logo}
            height={50}
            width={130}
            alt="logo"
            className="mb-8"
          />
          <h1 className="mb-2 text-xl font-normal">Add Admin</h1>
          <hr className="mb-6" />
          <AddAdminForm />
        </div>
      </section>
    </div>
  );
};

export default page;
