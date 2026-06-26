import {
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analyze", label: "Analyze", icon: Sparkles },
  { id: "history", label: "History", icon: History },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
      <div className="glass-card sticky top-6 space-y-2 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all ${
                active
                  ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-glow"
                  : "text-secondary hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}