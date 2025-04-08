import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { MdOutlineLogin } from "react-icons/md";
  import { Button } from "../ui/button";
  import { Input } from "../ui/input";
  import { Search } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  import { IoBookOutline } from "react-icons/io5";
import axios from "axios";
const AuthenticatedNavbar = () => {
    const navigate = useNavigate()
    const handleLogout = async() =>{
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/logout`,
            {},
            {withCredentials : true}
        );
        if (res.data.message === "logout successfull"){
            navigate('/')
        }
    }
  return (
    <div className="bg-white/5 backdrop-blur-lg fixed top-0 z-10 w-full h-16 flex items-center justify-between px-10">
        <div className="flex gap-8 items-center">
            <Link to={'/'} className="flex gap-2 text-xl items-center justify-center">
                <IoBookOutline />
                <span className="font-bold ">Learnify</span>
            </Link>
            <div>
              <ul className="font-semibold text-sm text-gray-600 mt-1">
                <Link to={'/courses'} className="cursor-pointer">Explore</Link>
              </ul>
            </div>
        </div>
      <div className="flex items-center w-full justify-end gap-4">
        <div className="w-1/4">
          <form className="mx-auto w-full">   
          <div className="flex items-center space-x-2 w-full max-w-md">
            <Input type="text" placeholder="Search..." className="flex-1" />
            <Button variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={'/profile'}><DropdownMenuItem>Profile</DropdownMenuItem></Link> 
            <Link to={'/dashboard'}><DropdownMenuItem>Dashboard</DropdownMenuItem></Link> 
            <hr />
            <DropdownMenuItem className="flex items-center justify-between" onClick={handleLogout}>
                <span>Log out</span>
                <MdOutlineLogin className="text-black ml-2" />
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </div>
  )
}

export default AuthenticatedNavbar