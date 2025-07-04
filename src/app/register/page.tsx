'use client';

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
import { registerUser } from '@/services/authService';
import { RegisterPayload } from '@/types';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function RegisterPage() {
  // State untuk semua input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (credentials: RegisterPayload) => registerUser(credentials),
    onSuccess: () => {
      alert(
        'Registrasi berhasil! Anda sekarang akan diarahkan ke halaman login.'
      );
      router.push('/login'); // Redirect ke halaman login setelah sukses
    },
    onError: (error) => {
      // Menampilkan pesan error dari backend (misal: 'Email already exists')
      alert('Registrasi Gagal: ' + error.message);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // Jika ada token, langsung redirect ke halaman utama
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana di sisi klien
    if (password !== confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-xl sm:text-2xl'>Buat Akun Baru</CardTitle>
          <CardDescription>
            Masukkan detail Anda untuk membuat akun baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='confirm-password'>Konfirmasi Password</Label>
                <Input
                  id='confirm-password'
                  type='password'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Mendaftarkan...' : 'Buat Akun'}
              </Button>
            </div>
          </form>
          <div className='mt-4 text-center text-sm'>
            Sudah punya akun?{' '}
            <Link href='/login' className='underline'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
