"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <ThemeProvider>
      <Dashboard userEmail={user.email} onLogout={handleLogout} />
    </ThemeProvider>
  );
}
