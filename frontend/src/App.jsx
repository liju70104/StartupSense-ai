import { lazy, Suspense, useState } from "react";
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Auth/Login.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Analyze = lazy(() => import("./pages/Analyze.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const Reports = lazy(() => import("./pages/Reports.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster richColors position="top-right" />

      {!isAuthenticated ? (
        <Login />
      ) : (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <Suspense fallback={<PageLoader />}>
            {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === "analyze" && <Analyze />}
            {activeTab === "history" && <History />}
            {activeTab === "reports" && <Reports />}
            {activeTab === "profile" && <Profile />}
            {activeTab === "settings" && <Settings />}
          </Suspense>
        </AppLayout>
      )}
    </>
  );
}

function PageLoader() {
  return (
    <div className="space-y-6">
      <section className="glass-card p-10">
        <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-5 h-5 w-1/2 animate-pulse rounded-xl bg-white/10" />
      </section>
      <div className="grid gap-5 md:grid-cols-4">
        <div className="glass-card h-40 animate-pulse" />
        <div className="glass-card h-40 animate-pulse" />
        <div className="glass-card h-40 animate-pulse" />
        <div className="glass-card h-40 animate-pulse" />
      </div>
    </div>
  );
}