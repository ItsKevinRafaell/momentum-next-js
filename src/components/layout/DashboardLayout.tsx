import React from 'react';
import Sidebar from './Sidebar';

// Komponen ini akan menerima 'children', yaitu konten halaman yang spesifik,
// dan 'title' untuk judul halaman.
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  return (
    <div className='flex h-screen bg-slate-50 dark:bg-slate-900'>
      {/* Kolom Sidebar (untuk sementara kita buat placeholder) */}
      <Sidebar />

      {/* Kolom Konten Utama */}
      <main className='flex-1 p-6 sm:p-8 overflow-y-auto'>
        <header>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50'>
            {title}
          </h1>
        </header>

        <div className='mt-8'>
          {children} {/* Di sinilah konten halaman spesifik akan ditampilkan */}
        </div>
      </main>
    </div>
  );
}
