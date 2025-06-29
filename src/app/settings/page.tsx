// file: src/app/settings/page.tsx
'use client';

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
import { changePassword, logoutUser } from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State untuk form ubah password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Mutasi untuk ubah password
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success(
        'Password berhasil diubah! Anda akan di-logout untuk login kembali.'
      );
      // Panggil logout untuk membersihkan sesi saat ini
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
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    if (!currentPassword || !newPassword) {
      toast.error('Semua field harus diisi.');
      return;
    }
    changePasswordMutation.mutate({
      old_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <DashboardLayout title='Pengaturan'>
      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>
              Ganti password Anda di sini. Setelah berhasil, Anda akan di-logout
              secara otomatis.
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
                  : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
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
