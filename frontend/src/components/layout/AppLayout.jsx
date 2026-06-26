import { AnimatePresence, motion } from "framer-motion";
import Topbar from "./Topbar.jsx";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analyze", label: "Analyze" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function AppLayout({ activeTab, setActiveTab, children }) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-primary transition-all duration-500">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.20),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <Topbar />

        <div className="glass-card mt-5 flex flex-wrap gap-3 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-5 py-3 text-sm font-extrabold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-glow"
                  : "text-secondary hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main className="mt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.35 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}