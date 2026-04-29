'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 1. Wait for the component to mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run this logic on the client
    const user = typeof window !== 'undefined' ? localStorage.getItem('habit-tracker-user') : null;

    // A. If NO user is found
    if (!user) {
      // If they are on a page that REQUIRES a user, send them to login
      if (pathname.startsWith('/dashboard') || pathname === '/') {
        console.log("No user found, redirecting to /login");
        router.replace('/login');
      }
    } 
    // B. If a user IS found
    else {
      // If they are on a page that is for GUESTS only, send them to dashboard
      if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
        console.log("User found, redirecting to /dashboard");
        router.replace('/dashboard');
      }
    }
  }, [pathname, router]);

  // To prevent the loop from flashing content, we render children 
  // but the useEffect handles the movement.
  return <>{children}</>;
}