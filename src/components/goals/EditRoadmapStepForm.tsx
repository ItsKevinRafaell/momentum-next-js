// file: src/components/goals/EditRoadmapStepForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateRoadmapStep } from '@/services/apiService';
import { RoadmapStep } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface EditRoadmapStepFormProps {
  step: RoadmapStep;
  onSuccess?: () => void;
}

export default function EditRoadmapStepForm({
  step,
  onSuccess,
}: EditRoadmapStepFormProps) {
  const [title, setTitle] = useState(step.title);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateRoadmapStep,
    onSuccess: () => {
      toast.success('Langkah roadmap berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Gagal memperbarui langkah: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ stepId: step.id, title });
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
        />
      </div>
      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}
