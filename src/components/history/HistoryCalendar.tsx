// file: src/components/history/HistoryCalendar.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getReviewByDate } from '@/services/apiService';
import { ReviewResponse } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedDateString = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : undefined;

  const { data: reviewData, isLoading } = useQuery<
    ReviewResponse | null,
    Error
  >({
    queryKey: ['history', selectedDateString],
    queryFn: () => getReviewByDate(selectedDateString!),
    enabled: !!selectedDateString && isDialogOpen,
    retry: false,
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date <= new Date()) {
      // Hanya proses tanggal yang valid
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Kalender Produktivitas</CardTitle>
          <CardDescription>
            Pilih sebuah tanggal untuk melihat ringkasan review harian Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={handleDateSelect}
            className='rounded-md border'
            disabled={(date) => date > new Date()}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ringkasan untuk {selectedDateString}</DialogTitle>
          </DialogHeader>
          <div className='mt-4 space-y-4'>
            {isLoading ? (
              <Skeleton className='h-20 w-full' />
            ) : reviewData ? (
              <>
                <blockquote className='border-l-2 pl-6 italic'>
                  {/* Gunakan nama field yang baru */}
                  {reviewData.aiFeedback}
                </blockquote>
                <div>
                  <h4 className='font-semibold mb-2'>Statistik:</h4>
                  {/* Gunakan nama field yang baru */}
                  {Array.isArray(reviewData.summary) &&
                  reviewData.summary.length > 0 ? (
                    <ul className='list-disc list-inside'>
                      {reviewData.summary.map((item) => (
                        <li key={item.status}>
                          <span className='capitalize'>{item.status}</span>:{' '}
                          {item.count}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-sm text-slate-500'>
                      Tidak ada statistik untuk hari ini.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p>Tidak ada review yang tersimpan untuk tanggal ini.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
