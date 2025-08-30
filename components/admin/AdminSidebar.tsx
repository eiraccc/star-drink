'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuList = [
    { name: 'Shop Management', path: '/admin/shop' },
    { name: 'User Management', path: '/admin/user' },
  ]

  return (
    <nav className="flex flex-col gap-2">
      {menuList.map(menu => (
        <Link
          href={menu.path}
          key={menu.name}
          className={`block p-2 hover:bg-background ${
            pathname.startsWith(menu.path) ? 'font-bold' : ''
          }`}
        >
          { menu.name }
        </Link>
      ))}
    </nav>
  )
}

export default AdminSidebar