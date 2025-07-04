// file: src/components/layout/DashboardLayout.tsx
'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  return (
    <div className='flex min-h-screen w-full bg-slate-50 dark:bg-slate-950'>
      {/* Sidebar untuk Desktop (Terlihat di layar medium ke atas) */}
      <aside className='hidden md:block w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black'>
        <Sidebar />
      </aside>

      <div className='flex flex-col flex-1'>
        {/* Header untuk Mobile dengan Tombol Menu */}
        <header className='flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white dark:bg-black px-6 sticky top-0 z-10'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='md:hidden'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-0 w-64'>
              {/* Tampilkan komponen Sidebar yang sama di dalam sheet */}
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Judul Halaman di Header */}
          <h1 className='text-lg font-semibold md:text-xl'>{title}</h1>
        </header>

        {/* Konten Utama */}
        <main className='flex-1 p-6 sm:p-8 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
