import { useState } from "react";
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Auth/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analyze from "./pages/Analyze.jsx";
import History from "./pages/History.jsx";
import Reports from "./pages/Reports.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

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
          {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === "analyze" && <Analyze />}
          {activeTab === "history" && <History />}
          {activeTab === "reports" && <Reports />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "settings" && <Settings />}
        </AppLayout>
      )}
    </>
  );
}