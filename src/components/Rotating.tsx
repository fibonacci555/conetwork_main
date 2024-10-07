import OrbitingCircles from "@/components/ui/orbiting-circles";
import { MdEngineering } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { FaSailboat } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaPlane } from "react-icons/fa6";



export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded- bg-background md:shadow-xl">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        Yourself
      </span>

      {/* Inner Circles */}
      
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <MdEngineering className="size-[50px] border-none bg-transparent" />

      </OrbitingCircles>
      
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
       <GoLaw className="size-[50px] border-none bg-transparent" />
 
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <FaSailboat className="size-[50px] border-none bg-transparent" />

      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <FaCar className="size-[50px] border-none bg-transparent" />

      </OrbitingCircles>
      
    </div>
  );
}


