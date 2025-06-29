// file: src/components/tasks/AddTaskForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createManualTask } from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AddTaskFormProps {
  onSuccess?: () => void; // Fungsi opsional untuk dipanggil setelah sukses
}

export default function AddTaskForm({ onSuccess }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createManualTask,
    onSuccess: () => {
      toast.success('Tugas baru berhasil ditambahkan!');
      queryClient.invalidateQueries({ queryKey: ['todaySchedule'] });
      onSuccess?.(); // Panggil fungsi onSuccess jika ada (untuk menutup dialog)
    },
    onError: (error) => {
      toast.error('Gagal menambah tugas: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong');
      return;
    }
    mutation.mutate({ title });
  };

  return (
    <form onSubmit={handleSubmit} className='grid items-start gap-4'>
      <div className='grid gap-2'>
        <Label htmlFor='title'>Judul Tugas</Label>
        <Input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Contoh: Mengerjakan laporan mingguan'
        />
      </div>
      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan Tugas'}
      </Button>
    </form>
  );
}
