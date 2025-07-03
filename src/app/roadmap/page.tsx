// file: src/app/roadmap/page.tsx
'use client';

import CreateGoalForm from '@/components/goals/CreateGoalForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getActiveGoal } from '@/services/apiService';
import { ActiveGoalResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Target } from 'lucide-react';

export default function RoadmapPage() {
  const { data, isLoading, isError, error } = useQuery<
    ActiveGoalResponse,
    Error
  >({
    queryKey: ['activeGoal'],
    queryFn: getActiveGoal,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='space-y-4'>
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
        </div>
      );
    }

    if (isError) {
      return <div className='text-red-500'>Error: {error.message}</div>;
    }

    if (!data?.goal) {
      return <CreateGoalForm />;
    }

    return (
      <div className='space-y-6'>
        <Card className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target /> Tujuan Utama Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-medium'>{data.goal.description}</p>
          </CardContent>
        </Card>

        <div>
          <h3 className='text-xl font-semibold mb-4'>
            Peta Jalan Anda (Roadmap)
          </h3>
          <div className='space-y-4'>
            {/* --- PERBAIKAN UTAMA DI SINI --- */}
            {/* Kita cek dulu apakah data.steps adalah sebuah array sebelum di-map */}
            {Array.isArray(data.steps) &&
              data.steps.map((step) => (
                <Card key={step.id}>
                  <CardContent className='p-4'>
                    <p className='font-semibold'>
                      Langkah {step.step_order}: {step.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            {/* --- AKHIR PERBAIKAN --- */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title='Roadmap & Tujuan'>
      {renderContent()}
    </DashboardLayout>
  );
}
