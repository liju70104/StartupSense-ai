import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  GraduationCap,
  Globe2,
  Clock,
  Calendar,
  BarChart3,
  Trophy,
  FileText,
  Brain,
  Rocket,
  Download,
  Edit3,
  LogOut,
  Camera,
  Lock,
  BadgeCheck,
  Save,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { useDashboard } from "../hooks/useDashboard.js";
import { useHistory } from "../hooks/useHistory.js";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export default function Profile() {
  const { user, logout } = useAuth();
  const email = user?.email;

  const { data: dashboard } = useDashboard(email);
  const { data: historyData } = useHistory(email);

  const history = historyData?.history || [];

  const [profile, setProfile] = useState({
    name: user?.name || "User",
    email: user?.email || "",
    role: "Founder",
    college: "VSB Engineering College",
    department: "Artificial Intelligence and Data Science",
    country_timezone: "India / Asia-Kolkata",
    created_at: "N/A",
    last_login: new Date().toLocaleString(),
    profile_photo: "",
  });

  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (!email) return;

    fetch(`${API_URL}/profile?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile({
            ...data.profile,
            name: data.profile.name || user?.name || "User",
            email: data.profile.email || email,
          });
        }
      })
      .catch(() => {
        toast.error("Profile could not be loaded");
      });
  }, [email, user?.name]);

  const favoriteIndustry = useMemo(() => {
    const counts = {};

    history.forEach((item) => {
      const key = item.industry || "General";
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Not available";
  }, [history]);

  const totalIdeas = Number(dashboard?.total_ideas || 0);
  const avgScore = Number(dashboard?.average_score || 0);
  const highScore = Number(dashboard?.highest_score || 0);
  const successRate = totalIdeas > 0 ? Math.round(avgScore) : 0;
  const latest = history[0];

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        profile_photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully");
        setEditing(false);
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch {
      toast.error("Backend not connected");
    }
  };

  const changePassword = async () => {
    if (
      !passwordForm.current_password ||
      !passwordForm.new_password ||
      !passwordForm.confirm_password
    ) {
      toast.error("Fill all password fields");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setPasswordOpen(false);
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Backend not connected");
    }
  };

  const exportMyData = () => {
    const file = new Blob(
      [JSON.stringify({ profile, dashboard, history }, null, 2)],
      { type: "application/json" }
    );

    downloadFile(file, "my_startupsense_profile_data.json");
    toast.success("Profile data exported");
  };

  const downloadPortfolio = () => {
    const text = `
STARTUPSENSE-AI PORTFOLIO PROFILE

Name: ${profile.name}
Email: ${profile.email}
Role: ${profile.role}
College: ${profile.college}
Department: ${profile.department}
Country/Timezone: ${profile.country_timezone}

Startup Activity:
Total Ideas: ${totalIdeas}
Average Score: ${avgScore}
Highest Score: ${highScore}
Reports Generated: ${history.length}
Success Rate: ${successRate}%
Favorite Industry: ${favoriteIndustry}

AI Activity:
Gemini Requests Used: ${history.length}
AI Reports Generated: ${history.length}
Last AI Analysis Date: ${latest?.created_at || "N/A"}
Most Recent Startup: ${latest?.startup_name || "N/A"}
`;

    const file = new Blob([text], { type: "text/plain" });
    downloadFile(file, "StartupSense_AI_Portfolio.txt");
    toast.success("Portfolio downloaded");
  };

  return (
    <div className="space-y-6">
      <section className="glass-card p-10">
        <h1 className="gradient-title font-display text-6xl font-extrabold">
          Founder Profile
        </h1>
        <p className="mt-4 text-secondary">
          Account information, startup analytics, AI activity, achievements, and quick actions.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="glass-card p-7 xl:col-span-4">
          <div className="relative mx-auto h-32 w-32">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-14 w-14 text-white" />
              )}
            </div>

            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 p-3">
              <Camera className="h-5 w-5 text-white" />
              <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
            </label>
          </div>

          <h2 className="mt-5 text-center font-display text-3xl font-extrabold text-primary">
            {profile.name}
          </h2>

          <p className="text-center text-secondary">{profile.role} Mode</p>

          <div className="mt-6 space-y-3">
            <Info icon={Mail} label="Email" value={profile.email} />
            <Info icon={GraduationCap} label="College" value={profile.college} />
            <Info icon={BadgeCheck} label="Department" value={profile.department} />
            <Info icon={Globe2} label="Country / Timezone" value={profile.country_timezone} />
            <Info icon={Calendar} label="Account Created" value={profile.created_at} />
            <Info icon={Clock} label="Last Login" value={profile.last_login} />
          </div>
        </div>

        <div className="space-y-5 xl:col-span-8">
          {editing && (
            <div className="glass-card p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-extrabold text-primary">
                  Edit Profile
                </h3>

                <button onClick={() => setEditing(false)}>
                  <X className="h-5 w-5 text-primary" />
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <EditInput label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                <EditInput label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
                <EditInput label="Role" value={profile.role} onChange={(v) => setProfile({ ...profile, role: v })} />
                <EditInput label="College" value={profile.college} onChange={(v) => setProfile({ ...profile, college: v })} />
                <EditInput label="Department" value={profile.department} onChange={(v) => setProfile({ ...profile, department: v })} />
                <EditInput label="Country / Timezone" value={profile.country_timezone} onChange={(v) => setProfile({ ...profile, country_timezone: v })} />
              </div>

              <button
                onClick={saveProfile}
                className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-extrabold text-white"
              >
                <Save className="mr-2 inline h-5 w-5" />
                Save Profile
              </button>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            <Stat icon={BarChart3} label="Total Startup Ideas" value={totalIdeas} />
            <Stat icon={Brain} label="Total Analyses" value={history.length} />
            <Stat icon={BarChart3} label="Average Score" value={avgScore} />
            <Stat icon={Trophy} label="Highest Score" value={highScore} />
            <Stat icon={FileText} label="Reports Generated" value={history.length} />
            <Stat icon={Rocket} label="Success Rate" value={`${successRate}%`} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="AI Activity">
              <Mini label="Gemini requests used" value={history.length} />
              <Mini label="AI reports generated" value={history.length} />
              <Mini label="Last AI analysis date" value={latest?.created_at || "N/A"} />
              <Mini label="Most recent startup" value={latest?.startup_name || "N/A"} />
              <Mini label="Favorite industry" value={favoriteIndustry} />
            </Panel>

            <Panel title="Achievements">
              <Achievement active={history.length >= 1} text="🥇 First Startup Submitted" />
              <Achievement active={history.length >= 10} text="🚀 10 Ideas Analyzed" />
              <Achievement active={true} text="📊 100% Profile Completed" />
              <Achievement active={history.length >= 1} text="🤖 AI Explorer" />
              <Achievement active={highScore >= 90} text="⭐ High Score (90+)" />
            </Panel>
          </div>

          <div className="glass-card p-7">
            <h3 className="font-display text-2xl font-extrabold text-primary">
              Quick Actions
            </h3>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Action icon={Edit3} label="Edit Profile" onClick={() => setEditing(true)} />
              <Action icon={Lock} label="Change Password" onClick={() => setPasswordOpen(!passwordOpen)} />
              <Action icon={Download} label="Export My Data" onClick={exportMyData} />
              <Action icon={FileText} label="Download Portfolio" onClick={downloadPortfolio} />
              <Action icon={LogOut} label="Logout" onClick={logout} />
            </div>

            {passwordOpen && (
              <div
                className="mt-5 rounded-3xl border p-5"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <h4 className="font-bold text-primary">Change Password</h4>

                <PasswordInput
                  placeholder="Current password"
                  value={passwordForm.current_password}
                  onChange={(v) => setPasswordForm({ ...passwordForm, current_password: v })}
                />

                <PasswordInput
                  placeholder="New password"
                  value={passwordForm.new_password}
                  onChange={(v) => setPasswordForm({ ...passwordForm, new_password: v })}
                />

                <PasswordInput
                  placeholder="Confirm new password"
                  value={passwordForm.confirm_password}
                  onChange={(v) => setPasswordForm({ ...passwordForm, confirm_password: v })}
                />

                <button
                  onClick={changePassword}
                  className="mt-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-white"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-2xl font-extrabold text-primary">{title}</h3>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="h-5 w-5 text-[color:var(--accent-blue)]" />
      <div>
        <p className="text-xs font-bold uppercase text-secondary">{label}</p>
        <p className="font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="glass-card p-6">
      <Icon className="h-6 w-6 text-[color:var(--accent-blue)]" />
      <p className="mt-4 text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-2 font-mono text-4xl font-bold text-[color:var(--accent-blue)]">
        {value}
      </p>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-1 font-bold text-primary">{value}</p>
    </div>
  );
}

function Achievement({ active, text }) {
  return (
    <div
      className={`rounded-2xl border p-4 font-bold ${
        active ? "text-primary" : "text-secondary opacity-50"
      }`}
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {active ? "✅ " : "🔒 "} {text}
    </div>
  );
}

function Action({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border p-4 text-left font-bold text-primary transition hover:-translate-y-1"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="mb-2 h-5 w-5 text-[color:var(--accent-blue)]" />
      {label}
    </button>
  );
}

function EditInput({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-secondary">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border px-4 py-3 text-primary outline-none"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      />
    </div>
  );
}

function PasswordInput({ placeholder, value, onChange }) {
  return (
    <input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-3 w-full rounded-2xl border px-4 py-3 text-primary outline-none"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    />
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