'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { storage } from '@/lib/storage';
import { SPLASH_DURATION } from '@/lib/constants';



export default function RootPage() {

  const router = useRouter();


  useEffect(() => {
    // Immediate log to see if this even runs
    console.log("RootPage Mounted");

    const timer = setTimeout(() => {
      const session = storage.getSession();
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, SPLASH_DURATION || 2000); // Fallback to 2s if constant is missing

    return () => clearTimeout(timer);
  }, [router]);


  return <SplashScreen />;
}