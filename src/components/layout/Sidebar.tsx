// file: src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Jadwal Hari Ini', icon: LayoutDashboard, href: '/' },
  { name: 'Roadmap & Tujuan', icon: Target, href: '/roadmap' },
  { name: 'Pengaturan', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');

    toast.success('Anda berhasil logout!');

    window.location.assign('/login');
  };

  return (
    <aside className='w-64 flex-shrink-0 h-full border-r border-slate-200 dark:ber-slate-800 bg-white dark:bg-black flex flex-col'>
      <div className='p-4 border-b border-slate-200 dark:border-slate-800'>
        <h2 className='text-xl font-bold tracking-tight'>Project Momentum</h2>
      </div>

      <nav className='flex-1 p-4 space-y-2'>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
              pathname === item.href
                ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                : ''
            }`}
          >
            <item.icon className='h-4 w-4' />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className='mt-auto p-4 border-t border-slate-200 dark:border-slate-800'>
        {/* Tombol Logout sekarang memanggil handler sederhana, tanpa useMutation */}
        <Button
          variant='ghost'
          className='w-full justify-start'
          onClick={handleLogout}
        >
          <LogOut className='mr-3 h-4 w-4' />
          Logout
        </Button>
      </div>
    </aside>
  );
}
