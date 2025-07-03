// file: src/components/goals/SortableRoadmapItem.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { RoadmapStep } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface SortableRoadmapItemProps {
  step: RoadmapStep;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function SortableRoadmapItem({
  step,
  onEdit,
  onDelete,
  isDeleting,
}: SortableRoadmapItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card>
        <CardContent className='p-3 flex items-center justify-between gap-2'>
          <div className='p-2 cursor-grab touch-none' {...listeners}>
            <GripVertical className='h-5 w-5 text-slate-400' />
          </div>
          <p className='font-semibold flex-1'>
            Langkah {step.step_order}: {step.title}
          </p>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-slate-500 hover:text-blue-500'
              onClick={onEdit}
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-slate-500 hover:text-red-500'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus langkah {step.title}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className='bg-red-600 hover:bg-red-700'
                    onClick={onDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
