"use client";
import { RiDashboard3Line, RiBookReadFill, RiBookMarkedLine } from 'react-icons/ri';
import { JSX } from 'react';
import { ChartPie, Bolt, CircleHelp, SidebarClose } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/lib/zustand-store';
import { useState, useEffect } from 'react';

const dashboardSidebarItems = [
    {
        title: 'Dashboard',
        icon: <RiDashboard3Line size={24}/>,
        link: '/dashboard'
    },
    {
        title: 'Students',
        icon: <RiBookReadFill size={24}/>,
        link: '/dashboard/students'
    },
    {
        title: 'Chapter',
        icon: <RiBookMarkedLine size={24}/>,
        link: '/dashboard/chapter'
    },
    {
        title: 'Help',
        icon: <CircleHelp size={24}/>,
        link: '/dashboard/help'
    },
    {
        title: 'Reports',
        icon: <ChartPie size={24}/>,
        link: '/dashboard/reports'
    },
    {
        title: 'Settings',
        icon: <Bolt size={24}/>,
        link: '/dashboard/settings'
    }
];

interface SidebarItemProps {
    title: string;
    icon: JSX.Element;
    link: string;
    active: boolean;
}

const SidebarItem = ({ title, icon, link, active }: SidebarItemProps) => {
    return (
        <Link
            href={link}
            className={cn('flex items-center py-4 px-6 text-gray-600 font-bold rounded-lg dark:text-gray-100 hover:text-blue-500 hover:dark:text-blue-500 transition-colors duration-200', {'bg-gray-200 text-neutral-800 dark:bg-gray-800 dark:text-neutral-100': active})}>
            {icon}
            <span className="ml-4">{title}</span>
        </Link>
    );
}

const Sidebar = () => {
    const pathname = usePathname();
    const { isOpen, close } = useSidebarStore();
    const [isWindowWide, setIsWindowWide] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          setIsWindowWide(window.innerWidth >= 768);
        };
    
        handleResize(); 
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

    return (
        (isOpen || isWindowWide) && (
            <motion.nav
                className="w-64 h-screen bg-white dark:bg-black px-3 fixed md:relative z-10 text-md"
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 50 }}
            >
                <div className="flex items-center justify-center py-4 gap-3">
                    <SidebarClose className="w-6 h-6 cursor-pointer md:hidden" onClick={() => close()} />
                    <Logo className='w-28 md:w-40' />
                </div>
                <div className="flex flex-col">
                    {dashboardSidebarItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            link={item.link}
                            active={pathname === item.link}
                        />
                    ))}
                </div>
            </motion.nav>
        )
    );
};

export { Sidebar }