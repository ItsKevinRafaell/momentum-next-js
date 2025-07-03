// file: src/hooks/useAuth.ts
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Hook ini sekarang mengembalikan object agar lebih fleksibel
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan state loading
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Jika ada token, kita anggap user sudah login
      setIsLoggedIn(true);
    } else {
      // Jika tidak ada token, dan kita TIDAK di halaman login/register...
      const publicPaths = ['/login', '/register'];
      if (!publicPaths.includes(pathname)) {
        // ...baru kita arahkan ke halaman login.
        router.push('/login');
      }
    }
    // Setelah selesai memeriksa, set loading menjadi false
    setIsLoading(false);
  }, [pathname, router]); // <- Bergantung pada pathname juga

  return { isLoading, isLoggedIn };
}
