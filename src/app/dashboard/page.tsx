import ProtectedRoute from '@/components/shared/ProtectedRoute';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* You can add a Sidebar or Navbar here later */}
                {children}
            </div>
        </ProtectedRoute>
    );
}