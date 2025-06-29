// file: src/components/goals/CreateGoalForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createGoal } from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateGoalForm() {
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      toast.success('Tujuan baru berhasil dibuat!');
      // Memaksa query 'activeGoal' untuk dijalankan ulang
      // Ini akan membuat halaman /roadmap me-refresh datanya dan beralih tampilan
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
    },
    onError: (error) => {
      toast.error('Gagal membuat tujuan: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Deskripsi tujuan tidak boleh kosong.');
      return;
    }
    mutation.mutate({ description });
  };

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Tetapkan Tujuan Utama Anda</CardTitle>
        <CardDescription>
          Apa pencapaian besar yang ingin Anda raih? Tuliskan di sini untuk
          memulai perjalanan Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='goal-description'>Tujuan Saya</Label>
            <Textarea
              id='goal-description'
              placeholder='Contoh: Menjadi seorang Web Developer dalam 6 bulan'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending
              ? 'Menyimpan...'
              : 'Simpan Tujuan & Buat Roadmap'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
