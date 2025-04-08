import { Badge } from "@/components/ui/badge"
import Footer from "@/components/ui/Footer"
import Navbar from "@/components/ui/Navbar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiTicktick } from "react-icons/si";
const Pricing = () => {
  return (
    <>
        <Navbar/>
        <div className="flex flex-col items-center justify-center py-2 px-12 lg:px-[10%] w-full my-12">
            <Badge variant={"outline"}>Pricing</Badge>
            <span className="text-3xl font-extrabold flex justify-center text-center my-4"> 
                Choose the right pricing plan for <br />you and your business
            </span>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center my-12">
            <Card className="sm:w-1/4">
                <CardHeader className="w-full">
                    <CardTitle className="flex flex-col items-center gap-4 justify-center text-2xl font-bold">
                        Free Plan
                    </CardTitle>
                    <CardDescription className="font-bold text-xl text-center text-gray-800 p-4">
                        <div className="bg-gray-100 w-full border rounded text-3xl p-4">
                            FREE
                            <Button className="mt-8 cursor-pointer" onClick={()=>{alert('coming soon...')}}>Get started now</Button>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 justify-start text-gray-600">
                    <p className="flex gap-2 items-center"><SiTicktick /> Access to limited courses</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> Community support</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> Course previews & samples</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> No certificate upon completion</p>
                </CardContent>
            </Card>
            <Card className="sm:w-1/4 bg-black text-white" >
                <CardHeader className="w-full">
                    <CardTitle className="flex items-center gap-4 justify-center text-2xl font-bold">
                        Unlimited Plan
                    </CardTitle>
                    <CardDescription className="font-bold text-xl text-center text-gray-800 p-4">
                        <div className="bg-white/5 w-full rounded p-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-gray-100 flex items-center text-3xl">10 $ </span><span className="text-sm text-gray-400 flex items-center ">/ month</span>
                            </div>
                            <Button className="mt-8 cursor-pointer" variant={"outline"} onClick={()=>{alert('coming soon...')}}>Get started now</Button>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 justify-start text-gray-300">
                    <p className="flex gap-2 items-center"><SiTicktick /> Access to all courses</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> Personalized learning tracks</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> Priority support</p>
                    <p className="flex gap-2 items-center"><SiTicktick /> Certificates upon completion</p>
                </CardContent>
            </Card>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Pricing