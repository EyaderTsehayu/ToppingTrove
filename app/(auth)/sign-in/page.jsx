import Image from "next/image";
import logo from "/public/images/logo.png";
import SideUi from "@/components/ui/SideUi";
import SignInForm from "@/components/forms/SignInForm";

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
          <h1 className="mb-2 text-2xl font-semibold">Login</h1>
          <hr className="mb-6" />
          <SignInForm />
        </div>
      </section>
    </div>
  );
};

export default page;
