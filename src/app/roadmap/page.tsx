// file: src/app/roadmap/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteRoadmapStep,
  getActiveGoal,
  reorderRoadmapSteps,
  updateRoadmapStepStatus,
} from '@/services/apiService';
import { ActiveGoalResponse, RoadmapStep } from '@/types';
import { Pencil, PlusCircle, Target } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateGoalForm from '@/components/goals/CreateGoalForm';
import EditGoalForm from '@/components/goals/EditGoalForm';
import AddRoadmapStepForm from '@/components/goals/AddRoadmapStepForm';
import EditRoadmapStepForm from '@/components/goals/EditRoadmapStepForm'; // <-- Import baru
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableRoadmapItem } from '@/components/goals/SortableRoadmapItem'; // <-- Import baru

export default function RoadmapPage() {
  // State untuk mengontrol semua dialog
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<RoadmapStep | null>(null);
  const [localSteps, setLocalSteps] = useState<RoadmapStep[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    ActiveGoalResponse,
    Error
  >({
    queryKey: ['activeGoal'],
    queryFn: getActiveGoal,
  });

  // Sinkronisasi state lokal dengan data dari server
  useEffect(() => {
    if (data?.steps) {
      setLocalSteps(data.steps);
    }
  }, [data?.steps]);

  const deleteStepMutation = useMutation({
    mutationFn: deleteRoadmapStep,
    onSuccess: () => {
      toast.success('Langkah roadmap berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
    },
    onError: (e: Error) => toast.error(`Gagal menghapus langkah: ${e.message}`),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderRoadmapSteps,
    onSuccess: () => {
      toast.success('Urutan roadmap diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
    },
    onError: () => {
      toast.error(
        'Gagal menyimpan urutan baru. Mengembalikan ke urutan semula.'
      );
      if (data?.steps) setLocalSteps(data.steps); // Revert on error
    },
  });

  // Drag and Drop Handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localSteps.findIndex((step) => step.id === active.id);
      const newIndex = localSteps.findIndex((step) => step.id === over.id);

      const reorderedSteps = arrayMove(localSteps, oldIndex, newIndex);
      setLocalSteps(reorderedSteps); // Optimistic UI update

      const orderedIds = reorderedSteps.map((step) => step.id);
      reorderMutation.mutate({ step_ids: orderedIds });
    }
  }

  const statusMutation = useMutation({
    mutationFn: updateRoadmapStepStatus,
    // Kita tidak perlu lagi optimistic update yang rumit di sini
    onError: () => {
      toast.error('Gagal memperbarui status. Perubahan dibatalkan.');
      // Jika gagal, kembalikan state UI ke data asli dari server
      if (data?.steps) setLocalSteps(data.steps);
    },
    onSuccess: () => {
      toast.success('Progres roadmap diperbarui!');
      // Cukup invalidate untuk memastikan sinkron, tapi UI sudah berubah duluan
      queryClient.invalidateQueries({ queryKey: ['activeGoal'] });
    },
  });

  // --- HANDLER BARU UNTUK UPDATE STATUS ---
  const handleStatusChange = (stepId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    // 1. LANGSUNG UPDATE STATE LOKAL (UI INSTAN)
    setLocalSteps((prevSteps) =>
      prevSteps.map((s) => (s.id === stepId ? { ...s, status: newStatus } : s))
    );

    // 2. JALANKAN MUTASI DI LATAR BELAKANG
    statusMutation.mutate({ stepId: stepId, status: newStatus });
  };

  if (isLoading) {
    return (
      <DashboardLayout title='Roadmap & Tujuan'>
        <div className='space-y-4'>
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-16 w-full' />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title='Roadmap & Tujuan'>
        <div className='text-red-500'>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  if (!data?.goal) {
    return (
      <DashboardLayout title='Roadmap & Tujuan'>
        <CreateGoalForm />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title='Roadmap & Tujuan'>
      <div className='space-y-6'>
        {/* Kartu Tujuan Utama */}
        <Card className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white'>
          <CardHeader className='relative'>
            <CardTitle className='flex items-center gap-2'>
              <Target /> Tujuan Utama Anda
            </CardTitle>
            <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-4 right-4 h-8 w-8 hover:bg-white/20'
                >
                  <Pencil className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Edit Tujuan Utama</DialogTitle>
                </DialogHeader>
                <EditGoalForm
                  currentGoal={data.goal}
                  onSuccess={() => setIsEditGoalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-medium'>{data.goal.description}</p>
          </CardContent>
        </Card>

        {/* Bagian Peta Jalan (Roadmap) */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-semibold'>Peta Jalan Anda (Roadmap)</h3>
            <Dialog open={isAddStepOpen} onOpenChange={setIsAddStepOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Tambah Langkah
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Tambah Langkah Roadmap Baru</DialogTitle>
                </DialogHeader>
                <AddRoadmapStepForm
                  goalId={data.goal.id}
                  onSuccess={() => setIsAddStepOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localSteps.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-4'>
                {localSteps.length > 0 ? (
                  localSteps.map((step) => (
                    <SortableRoadmapItem
                      key={step.id}
                      step={step}
                      onStatusChange={() =>
                        handleStatusChange(step.id, step.status)
                      }
                      // Tentukan status isProcessing
                      isProcessing={
                        statusMutation.isPending || deleteStepMutation.isPending
                      }
                      onEdit={() => setEditingStep(step)}
                      onDelete={() => deleteStepMutation.mutate(step.id)}
                      // Tambahan: Hanya tampilkan status 'isDeleting' pada item yang sedang dihapus
                    />
                  ))
                ) : (
                  <p className='text-sm text-slate-500'>
                    Belum ada langkah roadmap. Tambahkan langkah pertama Anda!
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Dialog untuk Edit Langkah Roadmap */}
      <Dialog
        open={!!editingStep}
        onOpenChange={(open) => !open && setEditingStep(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Langkah Roadmap</DialogTitle>
          </DialogHeader>
          {editingStep && (
            <EditRoadmapStepForm
              step={editingStep}
              onSuccess={() => setEditingStep(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
