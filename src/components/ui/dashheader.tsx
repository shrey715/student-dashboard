import { CgOptions } from "react-icons/cg";
import { Search, Bell, MessageSquareMore, CircleHelp, Sidebar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Toggle from '@/components/ui/toggle';
import { useSidebarStore } from "@/lib/zustand-store";
import { useState } from "react";

const SearchBar = () => {
    const [open, setOpen] = useState(false);

    return (
        open ? 
        <Search className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200" size={24} onClick={() => setOpen(!open)} />
        :
        <div className="relative flex flex-row justify-start items-center w-1/2 h-12 px-4 py-2 gap-3 rounded-lg bg-white dark:bg-black focus:outline focus:ring-2" >
            <Search
                className="text-gray-500 dark:text-gray-100"
                size={24}
                onClick={() => setOpen(!open)}
            />
            <input
                type="text"
                placeholder="Search your course"
                className="w-full h-full bg-transparent focus:outline-none text-neutral-700 dark:text-neutral-200"
            />
        </div>
    );
}

const AvatarComponent = () => {
    return (
        <div className="flex items-center rounded-lg gap-3 hover:bg-gray-200 hover:dark:bg-gray-800 p-2 cursor-pointer">
            <Avatar className="w-8 h-8 aspect-square border border-gray-200">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="avatar" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Adeline H. Dancy
            </span>
        </div>
    );
}    

const Toolbar = () => {
    return (
        <div className="flex items-center gap-2 md:gap-11">
            <Toggle size={24} className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200" />
            <Link href="/dashboard/help">
                <CircleHelp
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200"
                    size={24}
                />
            </Link>
            <Link href="/dashboard">   
                <MessageSquareMore
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200"
                    size={24}
                />
            </Link>
            <CgOptions
                className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200"
                size={24}
            />
            <Bell
                className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 cursor-pointer transition-colors duration-200"
                size={24}
            />
            <AvatarComponent />
        </div>
    );
}

const Dashheader = () => {
    const { open } = useSidebarStore();

    return (
        <header className="flex items-center justify-between">
            <div
                className="flex items-center gap-1 w-full"
            >
                <Sidebar className="text-gray-500 hover:text-blue-500 dark:text-gray-100 hover:dark:text-blue-500 transition-colors duration-200 w-6 h-6 cursor-pointer md:hidden" onClick={() => open()} size={24} />
                <SearchBar />
            </div>
            <Toolbar />
        </header>
    );
}

export default Dashheader;

