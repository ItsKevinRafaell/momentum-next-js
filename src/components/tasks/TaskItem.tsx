// file: src/components/tasks/TaskItem.tsx
'use client';

import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, updateTaskStatus } from '@/services/apiService';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react'; // Import ikon tong sampah
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const queryClient = useQueryClient();

  // Mutasi untuk update status (sudah ada)
  const updateStatusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      toast.success('Status tugas diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui status: ' + error.message);
    },
  });

  // --- LOGIKA BARU UNTUK HAPUS ---
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success('Tugas berhasil dihapus!');
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
    },
    onError: (error) => {
      toast.error('Gagal menghapus tugas: ' + error.message);
    },
  });
  // --- AKHIR LOGIKA BARU ---

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'completed' : 'pending';
    updateStatusMutation.mutate({ taskId: task.id, status: newStatus });
  };

  return (
    <Card>
      <CardContent className='p-3 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Checkbox
            id={`task-${task.id}`}
            checked={task.status === 'completed'}
            onCheckedChange={handleStatusChange}
            disabled={
              updateStatusMutation.isPending || deleteMutation.isPending
            }
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`text-sm font-medium leading-none transition-colors ${
              task.status === 'completed'
                ? 'line-through text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-slate-50'
            } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
          >
            {task.title}
          </label>
        </div>

        {/* --- TOMBOL HAPUS BARU DENGAN DIALOG KONFIRMASI --- */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-slate-500 hover:text-red-500'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak bisa dibatalkan. Ini akan menghapus tugas
                {task.title} secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate(task.id)}>
                Ya, Hapus Tugas
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* --- AKHIR TOMBOL HAPUS --- */}
      </CardContent>
    </Card>
  );
}
