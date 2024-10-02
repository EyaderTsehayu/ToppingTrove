import Fasting from "@/components/Feature/Fasting";
import FeaturedPizza from "@/components/Feature/FeaturedPizza";
import PopularPizza from "@/components/Feature/PopularPizza";
import TopRestaurant from "@/components/Feature/TopRestaurant";
import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className=" bg-gradient-to-b lg:h-[90vh] lg:pb-0 pb-12 from-white via-[#ffc993] to-[#fff8f1]">
        <Hero />
      </div>
      <FeaturedPizza />
      <TopRestaurant />
      <PopularPizza />
      <Fasting />
      {/* <Footer /> */}
    </div>
  );
}
