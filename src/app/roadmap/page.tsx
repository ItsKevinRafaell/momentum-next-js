// file: src/app/roadmap/page.tsx
'use client';

import CreateGoalForm from '@/components/goals/CreateGoalForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getActiveGoal } from '@/services/apiService';
import { ActiveGoalResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

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
      // Jika tidak ada goal, tampilkan form untuk membuatnya
      return <CreateGoalForm />;
    }
    // Jika ada goal, tampilkan roadmap seperti biasa
    return (
      <div className='space-y-6'>
        <Card className='bg-black text-white'>
          <CardContent className='p-6'>
            <h2 className='text-2xl font-bold mb-2'>Tujuan Utama Anda</h2>
            <p className='text-lg'>{data.goal.description}</p>
          </CardContent>
        </Card>
        <div>
          <h3 className='text-xl font-semibold mb-4'>
            Peta Jalan Anda (Roadmap)
          </h3>
          <div className='space-y-4'>
            {data.steps.map((step) => (
              <Card key={step.id}>
                <CardContent className='p-4'>
                  <p className='font-semibold'>
                    Langkah {step.step_order}: {step.title}
                  </p>
                </CardContent>
              </Card>
            ))}
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
