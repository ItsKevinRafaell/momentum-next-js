'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  changePassword,
  getCurrentUser,
  logoutUser,
} from '@/services/authService';
import { User } from '@/types';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State untuk form ubah password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Query untuk mendapatkan data user saat ini
  const { data: user, isLoading: isLoadingUser } = useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  // Mutasi untuk mengubah password
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(
        'Password berhasil diubah! Anda akan di-logout untuk login kembali.'
      );
      // Logout secara otomatis untuk keamanan
      logoutUser().finally(() => {
        queryClient.clear();
        router.push('/login');
      });
    },
    onError: (error) => {
      toast.error('Gagal ubah password: ' + error.message);
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua kolom password harus diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    changePasswordMutation.mutate({
      old_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <DashboardLayout title='Pengaturan'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='md:col-span-1'>
          <CardHeader>
            <CardTitle>Profil Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='email'>Alamat Email</Label>
              {isLoadingUser ? (
                <Skeleton className='h-10 w-full' />
              ) : (
                <Input
                  id='email'
                  type='email'
                  value={user?.email || ''}
                  readOnly
                  disabled
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-1'>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>
              Setelah berhasil, Anda akan di-logout dan perlu login kembali
              dengan password baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='current-password'>Password Saat Ini</Label>
                <Input
                  id='current-password'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='new-password'>Password Baru</Label>
                <Input
                  id='new-password'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id='confirm-password'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type='submit' disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending
                  ? 'Menyimpan...'
                  : 'Simpan Password Baru'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className='md:col-span-1'>
          <CardHeader>
            <CardTitle>Tampilan</CardTitle>
            <CardDescription>
              Sesuaikan tampilan aplikasi sesuai preferensi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label>Mode Tema</Label>
              <div className='flex items-center gap-2'>
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
