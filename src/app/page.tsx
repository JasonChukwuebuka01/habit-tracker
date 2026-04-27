'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { storage } from '@/lib/storage';
import { SPLASH_DURATION } from '@/lib/constants';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Start the timer based on our constant (e.g., 1200ms)
    const timer = setTimeout(() => {
      const session = storage.getSession();

      // 2. Decide where to go (Requirement 4)
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}