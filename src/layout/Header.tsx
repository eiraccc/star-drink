import React, { useState, useEffect } from 'react'
import { CupSoda, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
        <header className='flex justify-between items-center p-4 border-b-2 border-primary'>
            <Link to="/">
                <div className='text-primary'>
                    <CupSoda size="36" />
                </div>
            </Link>
            <h1 className='text-primary text-xl'>Drink</h1>
            <div className='flex items-center'>
                {location.pathname !== '/drink/add' && <Link to="/drink/add">
                    <button
                        className='bg-highlight text-white rounded-full px-2 py-2 mr-2'
                    >✚新增飲料</button>
                </Link>}
                <button
                    onClick={ collapseMode }
                    aria-label="切換模式"
                    className="flex items-center gap-2 bg-primary text-white px-2 py-2 rounded-full hover:bg-primary/80 transition"
                >
                    { isDarkMode ? <Moon /> : <Sun /> }
                </button>
            </div>
        </header>
    )
}

export default Header