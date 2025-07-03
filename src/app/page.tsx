// file: src/app/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
// ... import lain yang Anda butuhkan untuk menampilkan tugas ...
import TaskList from '@/components/tasks/TaskList'; // Asumsi kita buat komponen TaskList

export default function HomePage() {
  // Ambil isLoading dan isLoggedIn dari hook kita yang sudah diperbarui
  const { isLoading, isLoggedIn } = useAuth();

  // 1. Selama hook sedang memeriksa token, tampilkan layar loading
  if (isLoading) {
    return (
      <DashboardLayout title='Jadwal Hari Ini'>
        <div className='space-y-4 mt-8'>
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
        </div>
      </DashboardLayout>
    );
  }

  // 2. Hook sudah selesai loading, TAPI user tidak login (akan di-redirect oleh hook)
  // Tampilkan null agar tidak ada 'kedipan' UI yang tidak perlu.
  if (!isLoggedIn) {
    return null;
  }

  // 3. Jika kita sampai sini, artinya loading selesai DAN user sudah login
  // Baru kita tampilkan konten dashboard yang sesungguhnya.
  return (
    <DashboardLayout title='Jadwal Hari Ini'>
      {/* Di sini kita akan letakkan komponen yang menampilkan daftar tugas */}
      <TaskList />
    </DashboardLayout>
  );
}
