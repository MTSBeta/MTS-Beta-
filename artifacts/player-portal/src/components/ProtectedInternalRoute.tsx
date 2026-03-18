import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useInternalAuth } from "@/context/InternalAuthContext";

interface ProtectedInternalRouteProps {
  children: React.ReactNode;
}

export function ProtectedInternalRoute({ children }: ProtectedInternalRouteProps) {
  const { internalUser, isLoading } = useInternalAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080810" }}>
        <Loader2 size={32} className="animate-spin text-violet-400/50" />
      </div>
    );
  }

  if (!internalUser) {
    return <Redirect to="/internal/login" />;
  }

  return <>{children}</>;
}
