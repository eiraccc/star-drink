import React, { useState, useEffect } from 'react'
import { CupSoda, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const root = window.document.documentElement;
        isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [isDarkMode]);

    const collapseMode = ():void => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <header className='relative flex items-center justify-between p-4 border-b-2 border-primary'>
            <Link to="/">
                <div className='text-primary'>
                    <CupSoda size="36" />
                </div>
            </Link>
            <h1 className='text-primary text-xl absolute left-1/2 transform -translate-x-1/2'>
                Drink
            </h1>
            <div className='flex items-center'>
                {location.pathname !== '/drink/add' && <Link to="/drink/add">
                    <button
                        className='hidden sm:flex bg-highlight text-white rounded-full px-2 py-2 mr-2 items-center hover:opacity-80'
                    >
                        <FaPlus className='mr-2'/>
                        Add Drink
                    </button>
                </Link>}
                <button
                    onClick={ collapseMode }
                    aria-label="切換模式"
                    className="flex items-center gap-2 bg-primary text-white px-2 py-2 rounded-full hover:opacity-80 transition"
                >
                    { isDarkMode ? <Moon /> : <Sun /> }
                </button>
            </div>
            {location.pathname !== '/drink/add' && <Link
                to="/drink/add"
                className="sm:hidden fixed bottom-9 right-4 w-10 h-10 rounded-full bg-highlight text-white flex items-center justify-center shadow-lg hover:bg-primary/90 z-[9999]"
            >
                <FaPlus />
            </Link>}
        </header>
    )
}

export default Header