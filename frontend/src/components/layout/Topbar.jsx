import { Bell, Moon, Search, Sun, Rocket } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="glass-card flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow">
          <Rocket className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-primary">
            StartupSense-AI
          </h1>
          <p className="text-xs text-secondary">
            AI startup validation command center
          </p>
        </div>
      </div>

      <div className="hidden w-[360px] items-center gap-3 rounded-2xl border px-4 py-3 text-secondary md:flex"
        style={{
          borderColor: "var(--border)",
          background: "var(--card)"
        }}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search ideas, reports, insights...</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="glass-card p-3">
          <Bell className="h-5 w-5 text-primary" />
        </button>

        <button onClick={toggleTheme} className="glass-card p-3">
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>

        <div className="hidden glass-card px-4 py-3 md:block">
          <p className="text-sm font-bold text-primary">Liju</p>
          <p className="text-xs text-secondary">Founder mode</p>
        </div>
      </div>
    </div>
  );
}