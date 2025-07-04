// file: src/components/tasks/TaskList.tsx
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { getTodaySchedule, reviewDay } from '@/services/apiService';
import { ReviewResponse, Task } from '@/types';

import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, PlusCircle } from 'lucide-react';
import { getGreetingBasedOnTime } from '@/lib/utils';

export default function TaskList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
      </div>
    );
  }

  if (isError) {
    return <div className='text-red-500'>Error: {error.message}</div>;
  }

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {getGreetingBasedOnTime()}!
          </h2>
          <p className='text-slate-500 dark:text-slate-400'>
            Tugas Anda untuk hari ini:
          </p>
        </div>
        <div className='flex-shrink-0 flex gap-2'>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='h-4 w-4 mr-2' />
                Tambah Tugas
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Tambah Tugas Baru</DialogTitle>
                <DialogDescription>
                  Masukkan judul tugas baru Anda.
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

      <div className='space-y-4'>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <div className='flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 min-h-[400px]'>
            <div className='rounded-full bg-slate-100 dark:bg-slate-800 p-4'>
              <FileText className='h-8 w-8 text-slate-500 dark:text-slate-400' />
            </div>
            <h3 className='mt-4 text-lg font-semibold'>Tidak Ada Tugas</h3>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
              Anda belum memiliki tugas untuk hari ini. Tambahkan tugas baru
              atau nikmati hari luang Anda!
            </p>
          </div>
        )}
      </div>

      {/* --- Dialog untuk Menampilkan Hasil Review --- */}
      <Dialog
        open={!!reviewData}
        onOpenChange={(open) => !open && setReviewData(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ringkasan Hari Ini</DialogTitle>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            <blockquote className='border-l-2 pl-6 italic text-slate-700 dark:text-slate-300'>
              {reviewData?.ai_feedback}
            </blockquote>
            <div>
              <h4 className='font-semibold mb-2'>Statistik:</h4>
              <ul className='list-disc list-inside'>
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
    </>
  );
}
