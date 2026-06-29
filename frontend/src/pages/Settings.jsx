import { useEffect, useState } from "react";
import {
  Bell, Brain, Brush, Database, Download, FileJson, FileText,
  Lock, Mail, Monitor, Palette, RefreshCcw, Server, Shield,
  SlidersHorizontal, Sparkles, Trash2, Upload, Zap,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext.jsx";
import { useDashboard } from "../hooks/useDashboard.js";
import { useHistory } from "../hooks/useHistory.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "https://startupsense-ai-backend.onrender.com";

const defaultSettings = {
  accent: "Blue",
  fontSize: "Medium",
  animations: true,
  compactMode: false,
  emailNotifications: true,
  browserNotifications: true,
  analysisAlerts: true,
  weeklySummary: false,
  aiRecommendationAlerts: true,
  geminiModel: "Gemini AI",
  creativity: 0.7,
  responseLength: "Detailed",
  autoSwot: true,
  autoSave: true,
  twoFactor: false,
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const email = user?.email || "";

  const queryClient = useQueryClient();
  const { data: dashboard } = useDashboard(email);
  const { data: historyData } = useHistory(email);

  const history = historyData?.history || [];

  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("startup_settings")) || defaultSettings;
  });

  const [apiTime, setApiTime] = useState("Not checked");
  const [lastSync, setLastSync] = useState(new Date().toLocaleString());
  const [passwordPanel, setPasswordPanel] = useState(false);
  const [emailPanel, setEmailPanel] = useState(false);

  const [security, setSecurity] = useState({
    email: email,
    current_password: "",
    new_password: "",
    confirm_password: "",
    old_email: email,
    new_email: "",
  });

  useEffect(() => {
    localStorage.setItem("startup_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setSecurity((prev) => ({
      ...prev,
      email,
      old_email: email,
    }));
  }, [email]);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const changePassword = async () => {
    if (!security.email || !security.current_password || !security.new_password) {
      toast.error("Fill all password fields");
      return;
    }

    if (security.new_password !== security.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: security.email,
          current_password: security.current_password,
          new_password: security.new_password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setPasswordPanel(false);
        setSecurity({
          ...security,
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        queryClient.invalidateQueries();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Backend not connected");
    }
  };

  const changeEmail = async () => {
    if (!security.old_email || !security.new_email) {
      toast.error("Fill both email fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_email: security.old_email,
          new_email: security.new_email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`${data.message}. Please login again with new email.`);
        localStorage.removeItem("startup_user");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Backend not connected");
    }
  };

  const testBackend = async () => {
    if (!email) {
      toast.error("Login required");
      return;
    }

    const start = performance.now();

    try {
      const res = await fetch(`${API_URL}/dashboard?email=${email}`);
      await res.json();
      const end = performance.now();

      setApiTime(`${Math.round(end - start)} ms`);
      setLastSync(new Date().toLocaleString());
      toast.success("Backend speed tested");
    } catch {
      setApiTime("Failed");
      toast.error("Backend test failed");
    }
  };

  const exportJSON = () => {
    const file = new Blob(
      [JSON.stringify({ user, settings, dashboard, history }, null, 2)],
      { type: "application/json" }
    );
    downloadFile(file, "startupsense_export.json");
    toast.success("JSON exported");
  };

  const exportCSV = () => {
    const headers = ["Startup Name", "Industry", "Score", "Risk", "Status", "Created At"];
    const rows = history.map((item) => [
      item.startup_name || "Startup Idea",
      item.industry || "N/A",
      item.overall_score || "N/A",
      item.risk_level || "N/A",
      item.status || "N/A",
      item.created_at || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    downloadFile(new Blob([csv], { type: "text/csv" }), "startupsense_history.csv");
    toast.success("CSV exported");
  };

  const exportPDFText = () => {
    const text = `
STARTUPSENSE-AI REPORT EXPORT

User: ${user?.name || "User"}
Email: ${email}
Total Ideas: ${dashboard?.total_ideas || 0}
Average Score: ${dashboard?.average_score || 0}
Highest Score: ${dashboard?.highest_score || 0}
Reports: ${history.length}

Generated At: ${new Date().toLocaleString()}
`;

    downloadFile(new Blob([text], { type: "text/plain" }), "startupsense_report_export.txt");
    toast.success("Report exported");
  };

  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);

        if (imported.settings) {
          setSettings({ ...defaultSettings, ...imported.settings });
          toast.success("Backup imported successfully");
        } else {
          toast.error("No settings found in backup file");
        }
      } catch {
        toast.error("Invalid backup file");
      }
    };

    reader.readAsText(file);
  };

  const clearCache = () => {
    queryClient.clear();
    toast.success("React Query cache cleared");
  };

  const refreshBackend = () => {
    queryClient.invalidateQueries();
    setLastSync(new Date().toLocaleString());
    toast.success("Backend data refresh requested");
  };

  return (
    <div className="space-y-6">
      <section className="glass-card p-10">
        <h1 className="gradient-title font-display text-6xl font-extrabold">
          Settings Center
        </h1>
        <p className="mt-4 text-secondary">
          Manage account security, appearance, notifications, AI behavior, storage, and system status.
        </p>
        <p className="mt-3 text-sm text-secondary">
          Logged in as: <span className="font-bold text-primary">{email}</span>
        </p>
      </section>

      <Section title="Appearance" icon={Brush}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActionButton icon={theme === "dark" ? Monitor : Palette} label={`Theme: ${theme}`} onClick={toggleTheme} />
          <Select label="Accent Color Picker" value={settings.accent} onChange={(v) => update("accent", v)} options={["Blue", "Purple", "Green", "Orange"]} />
          <Select label="Font Size" value={settings.fontSize} onChange={(v) => update("fontSize", v)} options={["Small", "Medium", "Large"]} />
          <Toggle label="Animations" value={settings.animations} onChange={(v) => update("animations", v)} />
          <Toggle label="Compact Mode" value={settings.compactMode} onChange={(v) => update("compactMode", v)} />
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Toggle label="Email notifications" value={settings.emailNotifications} onChange={(v) => update("emailNotifications", v)} />
          <Toggle label="Browser notifications" value={settings.browserNotifications} onChange={(v) => update("browserNotifications", v)} />
          <Toggle label="Analysis completed alerts" value={settings.analysisAlerts} onChange={(v) => update("analysisAlerts", v)} />
          <Toggle label="Weekly summary" value={settings.weeklySummary} onChange={(v) => update("weeklySummary", v)} />
          <Toggle label="AI recommendation alerts" value={settings.aiRecommendationAlerts} onChange={(v) => update("aiRecommendationAlerts", v)} />
        </div>
      </Section>

      <Section title="AI Settings" icon={Brain}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Gemini model in use" value={settings.geminiModel} />
          <Range label="AI Creativity Level" value={settings.creativity} onChange={(v) => update("creativity", v)} />
          <Select label="Response Length" value={settings.responseLength} onChange={(v) => update("responseLength", v)} options={["Short", "Balanced", "Detailed"]} />
          <Toggle label="Auto-generate SWOT" value={settings.autoSwot} onChange={(v) => update("autoSwot", v)} />
          <Toggle label="Auto-save analysis" value={settings.autoSave} onChange={(v) => update("autoSave", v)} />
        </div>
      </Section>

      <Section title="Data & Storage" icon={Database}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActionButton icon={FileJson} label="Export JSON" onClick={exportJSON} />
          <ActionButton icon={FileText} label="Export CSV" onClick={exportCSV} />
          <ActionButton icon={Download} label="Export PDF/Text" onClick={exportPDFText} />

          <label
            className="cursor-pointer rounded-2xl border p-4 font-bold text-primary"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <Upload className="mb-2 h-5 w-5 text-[color:var(--accent-blue)]" />
            Import backup
            <input type="file" accept=".json" onChange={importBackup} className="hidden" />
          </label>

          <ActionButton icon={Trash2} label="Clear cache" onClick={clearCache} />
          <ActionButton icon={RefreshCcw} label="Refresh backend cache" onClick={refreshBackend} />
        </div>
      </Section>

      <Section title="Security" icon={Shield}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ActionButton icon={Lock} label="Change Password" onClick={() => setPasswordPanel(!passwordPanel)} />
          <ActionButton icon={Mail} label="Change Email" onClick={() => setEmailPanel(!emailPanel)} />
          <Info label="Active Session" value="Current authenticated browser session" />
          <Info label="Login Email" value={email || "Not available"} />
          <Toggle label="Two-factor authentication" value={settings.twoFactor} onChange={(v) => update("twoFactor", v)} />
        </div>
      </Section>

      {passwordPanel && (
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-extrabold text-primary">Change Password</h3>
          <SecurityInput placeholder="Email" value={security.email} onChange={(v) => setSecurity({ ...security, email: v })} />
          <SecurityInput placeholder="Current password" type="password" value={security.current_password} onChange={(v) => setSecurity({ ...security, current_password: v })} />
          <SecurityInput placeholder="New password" type="password" value={security.new_password} onChange={(v) => setSecurity({ ...security, new_password: v })} />
          <SecurityInput placeholder="Confirm new password" type="password" value={security.confirm_password} onChange={(v) => setSecurity({ ...security, confirm_password: v })} />
          <button onClick={changePassword} className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-bold text-white">
            Update Password
          </button>
        </div>
      )}

      {emailPanel && (
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-extrabold text-primary">Change Email</h3>
          <SecurityInput placeholder="Current email" value={security.old_email} onChange={(v) => setSecurity({ ...security, old_email: v })} />
          <SecurityInput placeholder="New email" value={security.new_email} onChange={(v) => setSecurity({ ...security, new_email: v })} />
          <button onClick={changeEmail} className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-bold text-white">
            Update Email
          </button>
        </div>
      )}

      <Section title="Backend Monitor" icon={Server}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Status label="Frontend" value="Online" />
          <Status label="Backend" value="Connected" />
          <Status label="MongoDB" value="Connected" />
          <Status label="Gemini API" value="Connected" />
          <Status label="Render" value="Running" />
        </div>
      </Section>

      <Section title="Developer Tools" icon={SlidersHorizontal}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Info label="API Response Time" value={apiTime} />
          <Info label="Current Backend URL" value={API_URL} />
          <Info label="React Version" value="React + Vite" />
          <Info label="FastAPI Version" value="StartupSense-AI API v2.0" />
          <Info label="MongoDB Collection Count" value={`${history.length} analysis records`} />
          <Info label="Last Synchronization Time" value={lastSync} />
          <ActionButton icon={Zap} label="Test Backend Speed" onClick={testBackend} />
        </div>
      </Section>

      <Section title="About" icon={Sparkles}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Info label="Application" value="StartupSense-AI" />
          <Info label="Version" value="2.0" />
          <Info label="Frontend" value="React + Vite" />
          <Info label="Backend" value="FastAPI" />
          <Info label="Database" value="MongoDB Atlas" />
          <Info label="AI" value="Gemini" />
          <Info label="Developer" value="Liju" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SecurityInput({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-3 w-full rounded-2xl border px-4 py-3 text-primary outline-none"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    />
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between rounded-2xl border p-4 text-left" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <span className="font-bold text-primary">{label}</span>
      <span className={`rounded-full px-3 py-1 text-sm font-bold ${value ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
        {value ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <p className="mb-2 text-sm font-bold text-secondary">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent font-bold text-primary outline-none">
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}

function Range({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <p className="mb-2 text-sm font-bold text-secondary">{label}: {value}</p>
      <input type="range" min="0" max="1" step="0.1" value={value} onChange={(e) => onChange(e.target.value)} className="w-full" />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <p className="text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-2 break-words font-bold text-primary">{value}</p>
    </div>
  );
}

function Status({ label, value }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <p className="font-bold text-primary">{label}</p>
      <p className="mt-2 font-bold text-[color:var(--accent-green)]">🟢 {value}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl border p-4 text-left font-bold text-primary transition hover:-translate-y-1" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <Icon className="mb-2 h-5 w-5 text-[color:var(--accent-blue)]" />
      {label}
    </button>
  );
}

function downloadFile(file, filename) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}