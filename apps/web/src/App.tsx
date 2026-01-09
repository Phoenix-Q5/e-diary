import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Shell } from "./components/Shell";
import { AuthProvider, useAuth } from "./state/auth";
import { AuthPage } from "./pages/AuthPage";
import { AppPage } from "./pages/AppPage";

const qc = new QueryClient();

function GuardedApp() {
  const { state } = useAuth();
  if (state.status === "loading") return <div className="p-6 text-sm text-zinc-600">Loading…</div>;
  if (state.status === "anon") return <Navigate to="/auth" replace />;
  return <AppPage />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Shell>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<GuardedApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Shell>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
