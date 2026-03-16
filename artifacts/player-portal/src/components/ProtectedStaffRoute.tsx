import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useStaffAuth } from "@/hooks/useStaffAuth";

interface ProtectedStaffRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedStaffRoute({ children, adminOnly = false }: ProtectedStaffRouteProps) {
  const { staffUser, isLoading } = useStaffAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (!staffUser) {
    return <Redirect to="/staff-login" />;
  }

  if (adminOnly && staffUser.role !== "academy_admin") {
    return <Redirect to="/staff-dashboard" />;
  }

  return <>{children}</>;
}
