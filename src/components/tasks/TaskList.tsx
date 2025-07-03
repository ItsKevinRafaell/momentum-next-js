// file: src/components/tasks/TaskList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getTodaySchedule } from '@/services/apiService';
import { Task } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import TaskItem from './TaskItem';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import AddTaskForm from './AddTaskForm';

export default function TaskList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery<Task[], Error>({
    queryKey: ['todaySchedule'],
    queryFn: getTodaySchedule,
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
    <div>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-slate-600 dark:text-slate-400'>
          Tugas Anda untuk hari ini:
        </p>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Tambah Tugas</Button>
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
      </div>

      <div className='space-y-4'>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <div className='border border-dashed border-slate-300 rounded-lg p-12 text-center'>
            <p>Tidak ada tugas untuk hari ini. Selamat beristirahat!</p>
          </div>
        )}
      </div>
    </div>
  );
}
