import { Bell, Moon, Search, Sun, Rocket, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useHistory } from "../../hooks/useHistory.js";

export default function Topbar({ setActiveTab }) {
  const { theme, toggleTheme } = useTheme();
  const { data } = useHistory();

  const history = data?.history || [];

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = history.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
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

        <button
          onClick={() => setSearchOpen(true)}
          className="hidden w-[360px] items-center gap-3 rounded-2xl border px-4 py-3 text-secondary md:flex"
          style={{
            borderColor: "var(--border)",
            background: "var(--card)",
          }}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search ideas, reports, insights...</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotifyOpen(!notifyOpen)}
            className="glass-card relative p-3"
          >
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
              {history.length > 0 ? Math.min(history.length, 9) : 1}
            </span>
          </button>

          <button onClick={toggleTheme} className="glass-card p-3">
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </button>

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="hidden glass-card px-4 py-3 text-left md:block"
          >
            <p className="text-sm font-bold text-primary">Liju</p>
            <p className="text-xs text-secondary">Founder mode</p>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl p-5">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-[color:var(--accent-blue)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search startup ideas, risks, scores..."
                className="w-full bg-transparent text-primary outline-none"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto">
              {query.trim() === "" ? (
                <p className="text-secondary">Start typing to search records.</p>
              ) : results.length === 0 ? (
                <p className="text-secondary">No matching records found.</p>
              ) : (
                results.slice(0, 6).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab("history");
                    }}
                    className="w-full rounded-2xl border p-4 text-left"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--card)",
                    }}
                  >
                    <p className="font-bold text-primary">
                      {item.startup_name || "Startup Idea"}
                    </p>
                    <p className="text-sm text-secondary">
                      Score: {item.overall_score || "N/A"} • Risk:{" "}
                      {item.risk_level || "N/A"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {notifyOpen && (
        <div className="absolute right-20 top-20 z-40 w-80 glass-card p-5">
          <h3 className="font-display text-xl font-extrabold text-primary">
            Notifications
          </h3>

          <div className="mt-4 space-y-3">
            <Notice
              title="System active"
              text="React frontend and FastAPI backend are connected."
            />
            <Notice
              title="MongoDB synced"
              text={`${history.length} startup analysis records available.`}
            />
            <Notice
              title="AI engine ready"
              text="Startup analysis engine is ready to evaluate ideas."
            />
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="absolute right-0 top-20 z-40 w-80 glass-card p-5">
          <h3 className="font-display text-xl font-extrabold text-primary">
            Founder Profile
          </h3>

          <div className="mt-4 rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <p className="font-bold text-primary">Liju</p>
            <p className="text-sm text-secondary">
              AI & Data Science Student
            </p>
          </div>

          <button
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("profile");
            }}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-extrabold text-white"
          >
            Open Profile
          </button>

          <button
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("settings");
            }}
            className="mt-3 w-full rounded-2xl border px-5 py-3 font-bold text-primary"
            style={{ borderColor: "var(--border)" }}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
}

function Notice({ title, text }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="font-bold text-primary">{title}</p>
      <p className="text-sm text-secondary">{text}</p>
    </div>
  );
}