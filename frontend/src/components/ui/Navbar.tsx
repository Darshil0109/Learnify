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
const Navbar = () => {
    
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
                        <DropdownMenuItem><Link to={'/profile'}>Profile</Link> </DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem className="flex items-center justify-between" >
                            <span>Log out</span>
                            <MdOutlineLogin className="text-black ml-2" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Link to={'/signin'}><Button className="hidden sm:flex cursor-pointer">Sign In <IoMdArrowRoundForward /></Button></Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar