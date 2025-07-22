import React, { useState, useEffect } from 'react'
import { CupSoda, Moon, Sun } from 'lucide-react';

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const root = window.document.documentElement;
        isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [isDarkMode]);

    const collapseMode = ():void => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <header className='flex justify-between items-center p-4 border-b-2 border-primary'>
            <div>
                <div className='text-primary'>
                    <CupSoda size="36" />
                </div>
            </div>
            <h1 className='text-primary text-xl'>Drink</h1>
            <div>
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