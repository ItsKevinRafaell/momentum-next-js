'use client'; // Komponen ini akan memiliki interaksi di sisi klien

import React from 'react';
// Import beberapa ikon yang akan kita gunakan
import {
  LayoutDashboard,
  //   CalendarCheck,
  Target,
  Settings,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logoutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Definisikan item menu kita dalam sebuah array agar mudah dikelola
const menuItems = [
  { name: 'Jadwal Hari Ini', icon: LayoutDashboard, href: '/' },
  { name: 'Roadmap & Tujuan', icon: Target, href: '/roadmap' },
];

const settingsMenu = [
  { name: 'Pengaturan', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  // Nanti kita akan tambahkan logic untuk mengetahui halaman mana yang aktif
  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname = usePathname();

  // Mutasi untuk logout
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Hapus semua cache data query agar bersih
      queryClient.clear();
      // Arahkan ke halaman login
      router.push('/login');
      toast.success('Anda berhasil logout!');
    },
    onError: () => {
      toast.error('Logout gagal, silakan coba lagi.');
    },
  });

  return (
    <aside className='w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black flex flex-col'>
      <div className='p-4 border-b border-slate-200 dark:border-slate-800'>
        <h2 className='text-xl font-bold tracking-tight'>Project Momentum</h2>
      </div>

      <nav className='flex-1 p-4 space-y-2'>
        {menuItems.map((item) => (
          // 4. Ganti tag <a> dengan komponen <Link>
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
              // 5. Logika untuk highlight menu aktif
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

      {/* Bagian bawah sidebar untuk Pengaturan dan Logout */}
      <div className='mt-auto p-4 border-t border-slate-200 dark:border-slate-800'>
        <nav className='space-y-2'>
          {settingsMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
                // 5. Logika untuk highlight menu aktif
                pathname === item.href
                  ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                  : ''
              }`}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          ))}
          <Button
            variant='ghost'
            className='w-full justify-start'
            onClick={() => logoutMutation.mutate()} // Panggil mutasi saat diklik
            disabled={logoutMutation.isPending} // Nonaktifkan saat proses logout
          >
            <LogOut className='mr-3 h-4 w-4' />
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </nav>
      </div>
    </aside>
  );
}
