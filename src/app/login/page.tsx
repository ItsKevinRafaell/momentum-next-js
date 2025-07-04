// file: src/app/login/page.tsx
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
import { loginUser } from '@/services/authService';
import { LoginPayload } from '@/types';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: (credentials: LoginPayload) => loginUser(credentials),
    onSuccess: (data) => {
      if (data.token) {
        toast.success('Login Berhasil!');
        // Simpan token ke localStorage
        localStorage.setItem('token', data.token);
        console.log('Token disimpan:', data.token);
        // Paksa full reload ke halaman utama
        window.location.assign('/');
      } else {
        toast.error('Token tidak ditemukan di respons server.');
      }
    },
    onError: (error) => {
      toast.error('Login Gagal: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-xl sm:text-2xl'>Login</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk login ke akun Anda.
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
              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Loading...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className='mt-4 text-center text-sm'>
            Belum punya akun?{' '}
            <Link href='/register' className='underline'>
              Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
