"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "/public/images/logo.png";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react"; // Import next-auth hooks

const Menu = () => (
  <>
    <p className=" hover:text-primary">
      <a href="/">Home</a>
    </p>
    <p className=" hover:text-primary">
      <a href="/order">Orders</a>
    </p>
    <p className=" hover:text-primary">
      <a href="/">Who we are</a>
    </p>
  </>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession(); // Get session info
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full z-10">
      <div className="flex gap-5 items-center px-2 md:pt-6 sm:mb-4 mb-3 sm:pt-4 pt-2 text-xl justify-between">
        <div className="flex justify-start">
          <Image
            src={logo}
            alt="logo"
            objectFit="cover"
            width={130}
            height={50}
            className="w-full z-10 h-full top-0 right-0 object-cover "
            onClick={() => router.push("/")}
          />
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex flex-row gap-24">
            <Menu />
          </div>
        </div>
        <div className="sm:block hidden justify-end">
          {session ? (
            // Show Sign Out button when session exists
            <button
              className="bg-primary text-white font-bold py-2 px-4 rounded-md"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          ) : (
            // Show Register button when no session exists
            <button
              className="bg-primary text-white font-bold py-2 px-4 rounded-md"
              onClick={() => router.push("/sign-in")}
            >
              Register
            </button>
          )}
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="ml-1 pr-4 relative sm:hidden">
          {toggleMenu ? (
            <RiCloseLine
              className="text-primary"
              size={27}
              onClick={() => setToggleMenu(false)}
            />
          ) : (
            <RiMenu3Line
              className="text-primary"
              size={27}
              onClick={() => setToggleMenu(true)}
            />
          )}
          {toggleMenu && (
            <div className="flex z-20 flex-col absolute m-1 drop-shadow-lg items-center">
              <div className="absolute text-base flex-col gap-8 w-56 bg-white items-start text-left pl-4 pr-16 pb-4 rounded-lg">
                <Menu />
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="bg-primary text-white font-semibold my-2 py-1 px-2 rounded-md"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="bg-primary text-white font-semibold my-2 py-1 px-2 rounded-md"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
