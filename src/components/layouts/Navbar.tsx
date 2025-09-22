import { Bell, ChevronDown, LogOut, Mail, Settings } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { constant } from "@/lib/constant";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="1xl:px-10 1xl:py-5 1xl:h-[88px] select-none">
      <div className="w-full h-full flex justify-between">
        <div className="flex 1xl:w-[443px] 1xl:h-[43px] items-center gap-6">
          <img src="/navbar/bars.svg" alt="bar icon" className="cursor-pointer"/>
          <div className=" 1xl:h-full flex items-center gap-[6px]">
            <img src="/navbar/globe.svg" alt="globe icon" />
            <div className="font-['Akatab'] 1xl:w-[50px] 1xl:h-[22px]">English</div>
          </div>
          <div className="1xl:w-[295px] h-full px-1.5 1xl:py-3 flex items-center bg-[#F8F8F8] shadow-inner shadow-[#F3F3F3] rounded-[6px]">
            <img className="cursor-pointer w-3 h-3" src="/navbar/magnifying-glass.svg" alt="mag. glass icon" />
            <Input className="font-['Akatab'] text-sm bg-transparent shadow-none focus:border-0 focus-visible:ring-0 focus:shadow-none focus:outline-0 border-0 outline-0 placeholder:text-[#D4D4D4]" placeholder="Search for booking, fleets, Chauffeurs"/>
          </div>
        </div>
        <div className="flex items-center gap-5">
        <div className="w-[364px] h-6 flex justify-end">
          <div className="h-full w-[316px] flex items-center justify-end gap-[22.5px]">
            <Mail className="cursor-pointer"/>
            <Bell className="cursor-pointer"/>
          </div>
        </div>
        <div className="w-[123px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <button className="flex gap-3 cursor-pointer hover:outline-none" onClick={()=>{setIsOpen(!isOpen);console.log("clicked")}}>
          <div className="rounded-[30px] bg-[#F5F5F5] w-12 h-12 flex items-center justify-center">
            <img src="/navbar/user-circle.svg" alt="user-circle.svg" />
            {/* <img className="w-full h-full" src="/navbar/user-circle.svg" alt="user-circle.svg" /> */}
          </div>
          <div className="flex items-center justify-center">
            <span>Admin</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-black transition-transform duration-600 p-[3px]', isOpen && 'rotate-180')} />
          </div>
          </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuItem onClick={() => {
                navigate('/settings');
              }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => {
                navigate(constant.ROUTING_URLS.SETTINGS);
              }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>{
                const remember = localStorage.getItem("remember") === "true";
                const savedEmail = localStorage.getItem("Email");
                localStorage.clear();
                if (remember && savedEmail) {
                  localStorage.setItem("remember", "true");
                  localStorage.setItem("Email", savedEmail);
                }
                navigate(constant.ROUTING_URLS.ADMIN_LOGIN)
              }}>
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>

        {/* Mobile menu button */}
      
      
      {/* Mobile Navigation */}
      
    </nav>
  );
};

export default Navbar;
