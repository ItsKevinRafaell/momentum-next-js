// file: src/components/goals/AddRoadmapStepForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addRoadmapStep } from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AddRoadmapStepFormProps {
  goalId: string;
  onSuccess?: () => void;
}

export default function AddRoadmapStepForm({
  goalId,
  onSuccess,
}: AddRoadmapStepFormProps) {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addRoadmapStep,
    onSuccess: () => {
      toast.success('Langkah baru berhasil ditambahkan!');
      // Refresh query 'activeGoal' untuk memuat ulang data roadmap
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
      onSuccess?.(); // Panggil fungsi untuk menutup dialog
    },
    onError: (error) => {
      toast.error('Gagal menambah langkah: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ goalId, title });
  };

  return (
    <form onSubmit={handleSubmit} className='grid items-start gap-4'>
      <div className='grid gap-2'>
        <Label htmlFor='step-title'>Judul Langkah</Label>
        <Input
          type='text'
          id='step-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Contoh: Belajar fundamental backend'
        />
      </div>
      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan Langkah'}
      </Button>
    </form>
  );
}
