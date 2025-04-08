import { IoBookOutline } from "react-icons/io5";
import { Button } from "./button";
import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaBarsStaggered } from "react-icons/fa6";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { MdOutlineLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
const Navbar = () => {
    const [isAuthenticated , setIsAuthenticated] = useState<boolean | null>(null);
    const handleLogout = async() =>{
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/logout`,
            {},
            {withCredentials : true}
        );
        if (res.data.message === "logout successfull"){
            setIsAuthenticated(false);
        }
    }
    useEffect(()=>{
        function getCookie(name:string) {
            const cookies = document.cookie.split("; ");
            for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
            }
            return null;
        }
        if (getCookie('accessToken')) {
            setIsAuthenticated(true);
        }
        else{
            setIsAuthenticated(false);
        }
    },[])
  return (
    <div className="flex justify-center w-full h-16 sticky top-0 mx-auto border-b z-10">
        <div className="flex items-center justify-between py-2 px-12 lg:px-[10%] w-full backdrop-blur-xl bg-white/80">
            <div className="flex gap-12 items-center">
                <Link to={'/'} className="flex gap-2 text-xl items-center justify-center">
                    <IoBookOutline />
                    <span className="font-bold ">Learnify</span>
                </Link>
                <div className="font-semibold text-sm text-gray-500 cursor-pointer hidden sm:flex gap-4 mt-1">
                    <Link to={'/courses'}>Explore</Link>
                    <Link to={'/pricing'}>Pricing</Link>
                </div>
            </div>
            <div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="sm:hidden"><FaBarsStaggered /></Button>
                    </SheetTrigger>
                    <SheetContent className="w-[300px]">
                        <SheetHeader>
                            <SheetTitle className="flex gap-2 items-center"><IoBookOutline />Learnify</SheetTitle>
                            <SheetDescription></SheetDescription>
                        </SheetHeader>
                        <div className="font-semibold text-sm text-gray-500 cursor-pointer flex flex-col gap-4 mt-1 mx-8">
                            <Link to={'/courses'}>Courses</Link>
                            <Link to={'/pricing'}>Pricing</Link>
                        </div>
                        <div className="mx-8">
                            <Link to={'/signin'}><Button className="flex cursor-pointer">Sign In <IoMdArrowRoundForward /></Button></Link>
                        </div>
                    </SheetContent>
                </Sheet>
                {!isAuthenticated ? 
                <Link to={'/signin'}><Button className="hidden sm:flex cursor-pointer">Sign In <IoMdArrowRoundForward /></Button></Link>
                : 
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link to={'/profile'}><DropdownMenuItem>Profile </DropdownMenuItem></Link>
                        <Link to={'/dashboard'}><DropdownMenuItem>Dashboard</DropdownMenuItem></Link> 
                        <hr />
                        <DropdownMenuItem className="flex items-center justify-between" onClick={handleLogout}>
                            <span>Log out</span>
                            <MdOutlineLogin className="text-black ml-2" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
            </div>
        </div>
    </div>
  )
}

export default Navbar