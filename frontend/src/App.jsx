import { useState } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Analyze from "./pages/Analyze.jsx";
import History from "./pages/History.jsx";
import Reports from "./pages/Reports.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "analyze" && <Analyze />}
      {activeTab === "history" && <History />}
      {activeTab === "reports" && <Reports />}
      {activeTab === "profile" && <Profile />}
      {activeTab === "settings" && <Settings />}
    </AppLayout>
  );
}