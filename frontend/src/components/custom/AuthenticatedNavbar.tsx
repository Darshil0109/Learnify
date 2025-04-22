import { useEffect, useState } from "react"
import { Menu, Search, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { IoBookOutline } from "react-icons/io5"
import { MdOutlineLogin } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger,SheetDescription, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import api from '@/axios/api'
const AuthenticatedNavbar = () => {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [avatar,setAvatar] = useState('')
  useEffect(()=>{
    const fetchUserData = async () => {
      const response = await api.get('/api/users');
      if (response.status === 200) {
        const userData = response.data;
        setAvatar(userData.profile_image);
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    }
    fetchUserData();
  },[])
  const handleLogout = async () => {
    try {
      const res = await api.post(`/api/auth/logout`, {})
      if (res.data.message === "logout successfull") {
        navigate("/")
      }
      
    } catch (error) {
      console.log("error coming",error);
      
    }
  }
  return (
    <div className="bg-white/5 backdrop-blur-lg fixed top-0 z-10 w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10">
      <div className="flex gap-4 sm:gap-8 items-center">
        <Link to={"/"} className="flex gap-2 text-xl items-center justify-center">
          <IoBookOutline />
          <span className="font-bold">Learnify</span>
        </Link>
        {/* Desktop navigation */}
        <div className="hidden sm:block">
          <ul className="font-semibold text-sm text-gray-600 mt-1">
            <Link to={"/courses"} className="cursor-pointer">
              Explore
            </Link>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4">
        {/* Desktop search */}
        <div className="hidden sm:block sm:w-full md:w-auto lg:w-full">
          <form className="mx-auto w-full">
            <div className="flex items-center space-x-2 w-full ">
              <Input type="text" placeholder="Search..." className="flex-1 " />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile search toggle */}
        <div className="sm:hidden">
          {isSearchOpen ? (
            <div className="fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Search</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <form className="w-full">
                <div className="flex items-center space-x-2 w-full">
                  <Input type="text" placeholder="Search..." className="flex-1 bg-white" autoFocus />
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* User dropdown - visible on all screens */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar>
              <AvatarImage src={avatar} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={"/dashboard"}>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
            <Link to={"/profile"}>
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between" onClick={handleLogout}>
              <span>Log out</span>
              <MdOutlineLogin className="text-black ml-2" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile menu - only visible on small screens */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
              
              <div className="flex flex-col h-full">
                {/* Header with proper accessibility */}
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="flex gap-2 text-xl items-center">
                    <IoBookOutline />
                    <span className="font-bold">Learnify</span>
                  </SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>

                {/* Navigation */}
                <div className="flex-1 py-6 px-6">
                  <nav className="flex flex-col gap-4">
                    <SheetClose asChild>
                      <Link to={"/courses"} className="font-semibold text-base hover:text-primary transition-colors">
                        Explore
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to={"/dashboard"} className="font-semibold text-base hover:text-primary transition-colors">
                        Dashboard
                      </Link>
                    </SheetClose>
                  </nav>
                </div>

                {/* Profile and Logout Section */}
                <div className="mt-auto border-t p-6">
                  {/* Profile Info */}
                  <SheetClose asChild>
                    <Link to={'/profile'} className="flex items-center gap-3 mb-6">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">John Doe</span>
                        <span className="text-sm text-muted-foreground">john.doe@example.com</span>
                      </div>
                    </Link>
                  </SheetClose>

                  {/* Logout Button */}
                  <SheetClose asChild>
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <span>Log out</span>
                      <MdOutlineLogin className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedNavbar