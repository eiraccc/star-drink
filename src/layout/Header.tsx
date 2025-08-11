'use client';
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDrinks2Line } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { FiSun, FiMoon } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        const root = window.document.documentElement;
        isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [isDarkMode]);

    const collapseMode = ():void => {
        setIsDarkMode(!isDarkMode)
    }

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const pageTitle = useMemo(() => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.length > 0 ? capitalize(paths[0]) : 'Drink';
      }, [pathname]);

    return (
        <header className='relative flex items-center justify-between p-4 border-b-2 border-primary'>
            <div className='flex'>
                <Link href="/">
                    <div className='text-primary hover:text-secondary mr-2'>
                        <RiDrinks2Line size={35} />
                    </div>
                </Link>
                <Link href="/shop">
                    <div className='text-primary hover:text-secondary'>
                        <MdStorefront size={35} />
                    </div>
                </Link>
            </div>
            
            <h1 className='text-primary text-xl absolute left-1/2 transform -translate-x-1/2'>
                { pageTitle }
            </h1>
            <div className='flex items-center'>
                {pathname !== '/drink/add' && !pathname.includes('admin') && (
                    <Link href="/drink/add">
                        <button
                            className='hidden sm:flex bg-highlight text-contrast rounded-full px-2 py-2 mr-2 items-center hover:opacity-80'
                        >
                            <FaPlus className='mr-2'/>
                            Add Drink
                        </button>
                    </Link>
                )}
                <button
                    onClick={ collapseMode }
                    aria-label="切換模式"
                    className="flex items-center gap-2 bg-primary text-contrast px-2 py-2 rounded-full hover:opacity-80 transition"
                >
                    { isDarkMode ? <FiMoon size={23} /> : <FiSun size={23} /> }
                </button>
            </div>
            {pathname !== '/drink/add' && (
                <Link
                    href="/drink/add"
                    className="sm:hidden fixed bottom-9 right-4 w-10 h-10 rounded-full bg-highlight text-contrast flex items-center justify-center shadow-lg hover:bg-primary/90 z-[9999]"
                >
                    <FaPlus />
                </Link>
            )}
        </header>
    )
}

export default Header