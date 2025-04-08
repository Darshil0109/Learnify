import Navbar from "@/components/ui/Navbar"
import Hero from "./Hero"
import Footer from "@/components/ui/Footer"
import Testimonials from "./Testimonials"
import Features from "./Features"

const Landing = () => {
  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center">
        <Navbar/>
        <Hero/>
        <Testimonials/>
        <Features/>
        <Footer/>
    </div>
  )
}

export default Landing