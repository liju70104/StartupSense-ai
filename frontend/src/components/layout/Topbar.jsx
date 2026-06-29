import {
  Bell,
  Clock,
  FileText,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  Rocket,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useHistory } from "../../hooks/useHistory.js";

export default function Topbar({ setActiveTab }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const email = user?.email || "";

  const { data, refetch } = useHistory(email);
  const history = data?.history || [];

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return history.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );
  }, [history, query]);

  const notifications = [
    {
      title: "System active",
      text: "React frontend and FastAPI backend are connected.",
    },
    {
      title: "MongoDB synced",
      text: `${history.length} startup analysis records available for your account.`,
    },
    {
      title: "AI engine ready",
      text: "Gemini AI startup analysis engine is ready.",
    },
  ];

  const unreadCount = Math.min(notifications.length + history.length, 9);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  const refreshData = async () => {
    await refetch();
    toast.success("Data refreshed");
  };

  return (
    <div className="relative">
      <div className="glass-card flex items-center justify-between px-5 py-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-3 text-left"
        >
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
        </button>

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
              {unreadCount}
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
            <p className="text-sm font-bold text-primary">
              {user?.name || "Founder"}
            </p>
            <p className="max-w-[170px] truncate text-xs text-secondary">
              {email || "Founder mode"}
            </p>
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
                placeholder="Search startup ideas, industries, risks, scores..."
                className="w-full bg-transparent text-primary outline-none"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto">
              {query.trim() === "" ? (
                <p className="text-secondary">Start typing to search your records.</p>
              ) : results.length === 0 ? (
                <p className="text-secondary">No matching records found.</p>
              ) : (
                results.slice(0, 8).map((item, index) => (
                  <button
                    key={item._id || index}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      setActiveTab("history");
                    }}
                    className="w-full rounded-2xl border p-4 text-left transition hover:-translate-y-1"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--card)",
                    }}
                  >
                    <p className="font-bold text-primary">
                      {item.startup_name || "Startup Idea"}
                    </p>
                    <p className="text-sm text-secondary">
                      {item.industry || "N/A"} • Score:{" "}
                      {item.overall_score || "N/A"} • Risk:{" "}
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
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-extrabold text-primary">
              Notifications
            </h3>
            <button
              onClick={refreshData}
              className="text-xs font-bold text-[color:var(--accent-blue)]"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.map((item, index) => (
              <Notice key={index} title={item.title} text={item.text} />
            ))}

            {history.slice(0, 3).map((item, index) => (
              <Notice
                key={`history-${index}`}
                title="Recent analysis"
                text={`${item.startup_name || "Startup Idea"} scored ${
                  item.overall_score || "N/A"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setNotifyOpen(false);
              setActiveTab("history");
            }}
            className="mt-4 w-full rounded-2xl border px-4 py-3 font-bold text-primary"
            style={{ borderColor: "var(--border)" }}
          >
            View History
          </button>
        </div>
      )}

      {profileOpen && (
        <div className="absolute right-0 top-20 z-40 w-80 glass-card p-5">
          <h3 className="font-display text-xl font-extrabold text-primary">
            Founder Mode
          </h3>

          <div
            className="mt-4 rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
                <User className="h-6 w-6 text-white" />
              </div>

              <div>
                <p className="font-bold text-primary">{user?.name || "Founder"}</p>
                <p className="max-w-[190px] truncate text-sm text-secondary">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Mini label="Ideas" value={history.length} />
            <Mini
              label="Best"
              value={
                history.length
                  ? Math.max(...history.map((x) => Number(x.overall_score || 0)))
                  : 0
              }
            />
          </div>

          <button
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("profile");
            }}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-extrabold text-white"
          >
            <User className="mr-2 inline h-4 w-4" />
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
            <Settings className="mr-2 inline h-4 w-4" />
            Settings
          </button>

          <button
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("reports");
            }}
            className="mt-3 w-full rounded-2xl border px-5 py-3 font-bold text-primary"
            style={{ borderColor: "var(--border)" }}
          >
            <FileText className="mr-2 inline h-4 w-4" />
            Reports
          </button>

          <button
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("history");
            }}
            className="mt-3 w-full rounded-2xl border px-5 py-3 font-bold text-primary"
            style={{ borderColor: "var(--border)" }}
          >
            <Clock className="mr-2 inline h-4 w-4" />
            History
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-2xl bg-red-500 px-5 py-3 font-extrabold text-white"
          >
            <LogOut className="mr-2 inline h-4 w-4" />
            Logout
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

function Mini({ label, value }) {
  return (
    <div
      className="rounded-2xl border p-3 text-center"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-[color:var(--accent-blue)]">
        {value}
      </p>
    </div>
  );
}