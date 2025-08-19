import React, { useEffect } from 'react'
import { Menu, School } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Link, useNavigate } from 'react-router-dom'
import DarkMode from '@/DarkMode'
import { useLogoutUserMutation } from '@/redux/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useTheme } from './ThemeProvider'

const Navbar = () => {
  const { user } = useSelector(state => state.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User loggedout");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 bg-gradient-to-t from-cyan-100/100 dark:from-cyan-950/100 fixed top-0 left-0 right-0 z-10 duration-300">
      {/* Desktop View */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-6 h-full">
        <div onClick={() => navigate("/")} className="flex items-center gap-2">
          <School className='cursor-pointer dark:text-gray-400' size={30} />
          <h1 className="font-extrabold text-2xl cursor-pointer dark:text-gray-400">E-Learning</h1>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link to="my-learning">My Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={"profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
                {
                  user?.role === "instructor" && (
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-blue-700" onClick={() => navigate("/login")}>Sign Up</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile View */}
      <div onClick={() => navigate("/")} className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = ({ user, logoutHandler }) => {
  const { setTheme } = useTheme();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row items-center justify-between mt-10">
          <SheetTitle className="text-xl font-bold">E-Learning</SheetTitle>
          <DarkMode />
        </SheetHeader>

        <nav className="grid gap-4 px-4 py-6">
          <Link to="my-learning" className="text-sm font-medium hover:underline">My Learning</Link>
          <Link to="profile" className="text-sm font-medium hover:underline">Profile</Link>
          <button onClick={logoutHandler} className="text-sm font-medium text-left">Logout</button>
        </nav>

        <SheetFooter className="flex flex-col items-center px-4 gap-2">
          {user?.role === 'instructor' && (
            <Link to="/admin/dashboard">
              <Button type="button">Dashboard</Button>
            </Link>
          )}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
