"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { ReduxProvider } from "@/lib/redux/provider";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { setAuthToken } from "@/services/axiosInstance";

interface ProvidersProps {
  children: ReactNode;
}

function AuthSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // do nothing
    if (status === "authenticated" && session?.user?.token) {
      setAuthToken(session.user.token);
    } else {
      setAuthToken("");
    }
  }, [status, session]);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthSync />
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
