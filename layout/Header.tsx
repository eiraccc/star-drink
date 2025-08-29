'use client';
import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDrinks2Line } from "react-icons/ri";
import { FaPlus, FaUserCircle, FaUser } from 'react-icons/fa';
import { FiSun, FiMoon } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { signOut } from '../lib/auth';
import { toast } from 'react-toastify';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const router = useRouter();
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
        <header className='relative flex items-center justify-between p-4 border-b-2 border-primary'>
            {isLoading && <LoadingOverlay />}

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
                    className="flex items-center gap-2 bg-primary text-contrast px-2 py-2 mr-2 rounded-full hover:opacity-80 transition"
                >
                    { isDarkMode ? <FiMoon size={23} /> : <FiSun size={23} /> }
                </button>

                <div className='relative'>
                    {user ? (
                        <button
                            className='flex items-center'
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <FaUserCircle size={40} className='text-secondary' />
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 border-2 rounded-full text-sm text-secondary border-secondary hover:border-primary hover:text-primary"
                            onClick={() => router.push('/login')}
                        >
                            Log in
                        </button>
                    )}
                    {isUserMenuOpen && (
                        <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-[160px] bg-white border rounded shadow-lg p-2"
                        >
                            <div
                                className="px-2 py-1 mb-2 w-full rounded flex items-center border-b border-primary text-primary"
                            >
                                <FaUser className='mr-2' />
                                { user?.name || '' }
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