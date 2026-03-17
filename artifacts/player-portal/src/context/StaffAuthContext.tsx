import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { staffLogin as apiLogin, fetchAcademyBranding, type StaffUser } from "@/lib/staffApi";

interface StaffAuthContextType {
  staffUser: StaffUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateStaffUser: (updates: Partial<StaffUser>) => void;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("staff_user");
    const storedToken = localStorage.getItem("staff_token");
    if (storedUser && storedToken) {
      try {
        const parsed: StaffUser = JSON.parse(storedUser);
        setStaffUser(parsed);

        fetchAcademyBranding()
          .then((branding) => {
            const refreshed: StaffUser = {
              ...parsed,
              academyName: branding.name,
              academyLogoText: branding.logoText,
              academyPrimaryColor: branding.primaryColor,
              academySecondaryColor: branding.secondaryColor,
              academyAccentColor: branding.accentColor,
              academyCrestUrl: branding.crestUrl,
              academyWelcomeMessage: branding.welcomeMessage,
              academyChantUrl: branding.chantUrl,
            };
            setStaffUser(refreshed);
            localStorage.setItem("staff_user", JSON.stringify(refreshed));
          })
          .catch(() => {});
      } catch {
        localStorage.removeItem("staff_user");
        localStorage.removeItem("staff_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem("staff_token", token);
    localStorage.setItem("staff_user", JSON.stringify(user));
    setStaffUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");
    setStaffUser(null);
  }, []);

  const updateStaffUser = useCallback((updates: Partial<StaffUser>) => {
    setStaffUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("staff_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <StaffAuthContext.Provider value={{ staffUser, isLoading, login, logout, updateStaffUser }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuthContext() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuthContext must be used within StaffAuthProvider");
  return ctx;
}
