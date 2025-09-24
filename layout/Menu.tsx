'use client';
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDrinks2Line } from "react-icons/ri";
import { FaPlus, FaUserCircle, FaUser } from 'react-icons/fa';
import { FiSun, FiMoon } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import { signOut } from '../lib/auth';
import { toast } from 'react-toastify';

const Sidebar = ({isHorizontal = false}) => {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        const root = window.document.documentElement;
        isDarkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [isDarkMode]);

    const collapseMode = ():void => {
        setIsDarkMode(!isDarkMode)
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const pageTitle = useMemo(() => {
      const paths = pathname.split('/').filter(Boolean);
      return paths.length > 0 ? capitalize(paths[0]) : 'Drink';
    }, [pathname]);

    const [isLoading, setIsLoading] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { user } = useAuth();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut();
            toast.success('Signed out!');
            setIsUserMenuOpen(false);
        } catch (err: any) {
            console.log('err', err.message);
            toast.error("Sign out error! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='p-2 w-full h-full'>
            <div className={`
                bg-primary
                w-full h-full
                shadow-xl shadow-gray-400/50
                rounded-xl
                flex justify-between items-center
                ${isHorizontal ? '' : 'flex-col py-2'}
                
            `}>
                <div
                    className={`flex ${isHorizontal ? "flex-row items-center space-x-4 px-4" : "flex-col items-center"}`}
                >
                    <Link href="/" title="back to home">
                        <div
                            className={`whitespace-nowrap font-bold hover:text-secondary text-surface-light
                            ${isHorizontal ? "" : "-rotate-90 mt-10"}
                            `}
                        >
                            Star Drink
                        </div>
                    </Link>
                    <Link
                        href="/drink/add"
                        title="add drink review"
                        className={`
                            rounded-full bg-highlight text-contrast flex items-center justify-center shadow-lg hover:text-text
                            ${isHorizontal ? "w-10 h-10 ml-0 mt-0" : "w-14 h-14 ml-6 mt-8"}
                        `}
                    >
                        <FaPlus />
                    </Link>
                </div>

                <div className={`
                    flex-1 flex justify-center items-center
                    ${isHorizontal ? '' : 'flex-col'}
                `}>
                    <Link
                        href="/"
                        title="drink list"
                        className={`
                            flex items-center justify-center w-12 h-12
                            text-background hover:text-surface-light
                            rounded-full transition relative
                            ${ pageTitle === 'Drink' ? 'text-surface-light' : ''}
                        `}
                    >
                        <RiDrinks2Line size={35} />
                        <span
                            className={`
                                absolute ${isHorizontal ? "bottom-0 left-0 w-full h-1" : "top-0 -right-[3px] w-1 h-full"}
                                bg-surface-light rounded-l-full transition-all duration-300 ease-in-out
                                ${pageTitle === "Drink" ? "opacity-100" : "opacity-0"}
                            `}
                        ></span>
                    </Link>

                    <Link
                        href="/shop"
                        title="shop list"
                        className={`
                            flex items-center justify-center w-12 h-12
                            text-background hover:text-secondary
                            rounded-full transition relative
                            ${ pageTitle === 'Shop'? 'text-surface-light' : ''}
                        `}
                    >
                        <MdStorefront size={35} />
                        <span
                            className={`
                                absolute ${isHorizontal ? "bottom-0 left-0 w-full h-1" : "top-0 -right-[1px] w-1 h-full"}
                                bg-surface-light rounded-l-full transition-all duration-300 ease-in-out
                                ${pageTitle === "Shop" ? "opacity-100" : "opacity-0"}
                            `}
                        ></span>
                    </Link>
                </div>

                <div className={`
                    flex
                    ${isHorizontal ? "flex-row items-center space-x-2 px-4" : "flex-col items-center space-y-2"}
                `}>
                    <button
                        onClick={ collapseMode }
                        aria-label="切換模式"
                        title="change mode"
                        className="flex items-center gap-2 bg-background text-primary px-2 py-2 rounded-full hover:opacity-80 transition"
                    >
                        { isDarkMode ? <FiMoon size={20} /> : <FiSun size={20} /> }
                    </button>

                    {/* login */}
                    <div className='relative'>
                        {user ? (
                            <button
                                className='flex items-center'
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <FaUserCircle size={36} className='text-background' />
                            </button>
                        ) : (
                            <button
                                title="log in"
                                className="flex items-center"
                                onClick={() => router.push('/login')}
                            >
                                <FaUserCircle size={36} className='text-background' />
                            </button>
                        )}
                        {isUserMenuOpen && (
                            <div
                                ref={menuRef}
                                className={`
                                    ${isHorizontal ? "top-full -right-2 mt-2" : "-top-8 left-full ml-3"}
                                    absolute w-[160px] bg-white border rounded shadow-lg p-2 z-10
                                `}
                            >
                                <div
                                    className="px-2 py-1 mb-2 w-full rounded flex items-center border-b border-primary text-primary"
                                >
                                    <FaUser className='mr-2' />
                                    { user?.userName || '' }
                                </div>
                                <button
                                    className="block px-2 py-1 w-full hover:bg-surface rounded"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Sidebar;