// components/Hero.js
import {
  MdUpgrade,
  MdEventSeat,
  MdShoppingBag,
  MdHotel,
  MdMiscellaneousServices,
} from "react-icons/md";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import FlightBookingTabs from '@/components/FlightsSearch/FlightBookingTabs';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="relative bg-black lg:h-[80vh]"
      data-aos="fade-down"
      data-aos-delay="300"
      data-aos-duration="3000"
    >
      <video
        autoPlay
        muted
        loop
        loading="lazy"
        className="absolute z-10 w-full h-full lg:top-0 -top-[12vh] object-cover opacity-55"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="relative z-20 lg:h-full h-screen max-w-[1200px] px-2 lg:pt-0 pt-16 mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <p className="text-3xl text-green-500">Hãy cùng chung tay</p>
          <h4 className="lg:text-[52px] text-3xl text-white mt-5">
            Hành trình giúp đỡ
          </h4>
          <p className="text-gray text-2xl my-8">
            🌱 Chung tay hôm nay, vì ngày mai tốt đẹp hơn
          </p>
        </div>
        <div className="">
          <Link href={isAuthenticated ? "/user/dashboard" : "/login"}>
            <Button
              className="relative overflow-hidden bg-green-500 text-white text-lg font-semibold px-8 py-4 rounded-2xl 
             transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Tham gia ngay</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 
                   translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
            </Button>
          </Link>

        </div>
        <div className="w-full flex items-center justify-center">
          {/* Placeholder for SearchForm */}
        </div>
      </div>
    </div>
  );
}