'use client';
// file: src/app/history/page.tsx
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';

// Lakukan dynamic import dengan opsi ssr: false
const HistoryCalendar = dynamic(
  () => import('@/components/history/HistoryCalendar'),
  {
    ssr: false, // <-- Ini kuncinya: Nonaktifkan Server-Side Rendering untuk komponen ini
    loading: () => (
      // Tampilkan skeleton saat komponen dimuat
      <div className='space-y-4'>
        <Skeleton className='h-80 w-full' />
      </div>
    ),
  }
);

export default function HistoryPage() {
  return (
    <DashboardLayout title='Riwayat & Analitik'>
      <HistoryCalendar />
    </DashboardLayout>
  );
}
