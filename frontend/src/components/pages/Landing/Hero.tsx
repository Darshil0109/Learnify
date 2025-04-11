import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-12 lg:px-[10%] w-full my-24">
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold justify-center sm:justify-start"> 
            Explore Courses
            <span className="sm:hidden text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                &nbsp;on <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Learnify</span>
            </span>
        </span>
        <span className="text-4xl hidden sm:block sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            &nbsp;on <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Learnify</span>
        </span>
        <div className="flex gap-4 mt-12">
            <Link to={'/courses'}><Button className="cursor-pointer">Explore Courses</Button></Link>
            <Link to={'/dashboard'}><Button className="cursor-pointer " variant={"outline"}>Get Started</Button></Link>
        </div>
    </div>
  )
}

export default Hero