// file: src/components/goals/EditGoalForm.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateGoal } from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface EditGoalFormProps {
  currentGoal: { id: string; description: string };
  onSuccess?: () => void;
}

export default function EditGoalForm({
  currentGoal,
  onSuccess,
}: EditGoalFormProps) {
  const [description, setDescription] = useState(currentGoal.description);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      toast.success('Tujuan berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Gagal memperbarui tujuan: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ goalId: currentGoal.id, description });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid gap-2'>
        <Label htmlFor='goal-description'>Deskripsi Tujuan Baru</Label>
        <Textarea
          id='goal-description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Menyimpan...' : 'Simpan & Buat Ulang Roadmap'}
      </Button>
    </form>
  );
}
