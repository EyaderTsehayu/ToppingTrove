import RegistrationForm from "@/components/forms/RegistrationForm";
import Image from "next/image";
import logo from "/public/images/logo.png";
import SideUi from "@/components/ui/SideUi";

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
            className="mb-16"
          />

          <RegistrationForm />
        </div>
      </section>
    </div>
  );
};

export default page;
