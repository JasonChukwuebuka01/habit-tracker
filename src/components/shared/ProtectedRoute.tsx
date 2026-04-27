'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import SplashScreen from '@/components/shared/SplashScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    const router = useRouter();

    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        const session = storage.getSession();

        if (!session) {
            router.replace('/login');
        } else {
    
            setIsAuthorized(true);
        }
    }, [router]);


    if (!isAuthorized) {
        return <SplashScreen />;
    }

   
    return <>{children}</>;
};