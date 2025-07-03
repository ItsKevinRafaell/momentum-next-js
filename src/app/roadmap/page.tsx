// file: src/app/roadmap/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActiveGoal } from '@/services/apiService';
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

export default function RoadmapPage() {
  // State untuk mengontrol semua dialog
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<RoadmapStep | null>(null);

  const { data, isLoading, isError, error } = useQuery<
    ActiveGoalResponse,
    Error
  >({
    queryKey: ['activeGoal'],
    queryFn: getActiveGoal,
  });

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
          <div className='space-y-4'>
            {Array.isArray(data.steps) && data.steps.length > 0 ? (
              data.steps.map((step) => (
                <Card key={step.id}>
                  <CardContent className='p-3 flex items-center justify-between'>
                    <p className='font-semibold flex-1'>
                      Langkah {step.step_order}: {step.title}
                    </p>
                    <div className='flex items-center'>
                      {/* Tombol Edit untuk setiap langkah */}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-slate-500 hover:text-blue-500'
                        onClick={() => setEditingStep(step)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      {/* Placeholder untuk tombol hapus nanti */}
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className='text-sm text-slate-500'>
                Belum ada langkah roadmap. Tambahkan langkah pertama Anda!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- DIALOG UNTUK EDIT LANGKAH ROADMAP --- */}
      {/* Dialog ini berada di luar map, dan hanya muncul jika ada `editingStep` */}
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
