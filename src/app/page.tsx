// file: src/app/page.tsx
'use client';

import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { ReviewResponse, Task } from '@/types';
import { getTodaySchedule, reviewDay } from '@/services/apiService';

import DashboardLayout from '@/components/layout/DashboardLayout';
import TaskItem from '@/components/tasks/TaskItem';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function HomePage() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ['todaySchedule'],
    queryFn: getTodaySchedule,
  });

  const reviewMutation = useMutation({
    mutationFn: reviewDay,
    onSuccess: (data) => {
      toast.success('Review harian selesai!');
      setReviewData(data);
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
    },
    onError: (error) => {
      toast.error('Gagal melakukan review: ' + error.message);
    },
  });

  return (
    <DashboardLayout title='Jadwal Hari Ini'>
      {/* Bagian Header dengan Tombol Aksi */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg text-slate-600 dark:text-slate-400'>
          Tugas Anda untuk hari ini:
        </h2>

        {/* Grup Tombol Aksi */}
        <div className='flex items-center gap-2'>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>+ Tambah Tugas</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Tambah Tugas Baru</DialogTitle>
                <DialogDescription>
                  Masukkan judul tugas baru Anda. Anda bisa mengatur deadline
                  nanti.
                </DialogDescription>
              </DialogHeader>
              <AddTaskForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button
            variant='outline'
            onClick={() => reviewMutation.mutate()}
            disabled={reviewMutation.isPending}
          >
            {reviewMutation.isPending ? 'Memproses...' : 'Review Hari Ini'}
          </Button>
        </div>
      </div>

      {/* Bagian Konten Utama (Daftar Tugas) */}
      <div className='space-y-4'>
        {isLoading && (
          // Tampilan Skeleton Loading
          <>
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-16 w-full' />
          </>
        )}

        {isError && (
          // Tampilan Error
          <div className='text-red-500'>Error: {error.message}</div>
        )}

        {!isLoading && !isError && (
          // Tampilan Data Sukses atau Kosong
          <>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className='border border-dashed border-slate-300 rounded-lg p-12 text-center'>
                <p>Tidak ada tugas untuk hari ini. Selamat beristirahat!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog untuk Menampilkan Hasil Review */}
      <Dialog
        open={!!reviewData}
        onOpenChange={(open) => !open && setReviewData(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ringkasan Hari Ini</DialogTitle>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            <p className='text-sm text-slate-700 dark:text-slate-300 italic'>
              {reviewData?.ai_feedback}
            </p>
            <div>
              <h4 className='font-semibold mb-2'>Statistik:</h4>
              <ul className='list-disc list-inside'>
                {/* Pengecekan aman untuk memastikan summary adalah array */}
                {Array.isArray(reviewData?.summary) &&
                  reviewData.summary.map((item) => (
                    <li key={item.status}>
                      <span className='capitalize'>{item.status}</span>:{' '}
                      {item.count}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
