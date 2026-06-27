import { useState } from "react";
import { Lock, Mail, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext.jsx";
import Register from "./Register.jsx";

const API_URL = "http://127.0.0.1:8000";

export default function Login() {
  const { login, authLoading } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (mode === "register") {
    return <Register setMode={setMode} />;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    await login(email, password);
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail || !newPassword || !confirmPassword) {
      toast.error("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setMode("login");
        setEmail(resetEmail);
        setPassword("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Backend not connected");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-6 py-10 text-primary">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.20),transparent_30%)]" />

      <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="glass-card p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow">
            <Rocket className="h-8 w-8 text-white" />
          </div>

          <h1 className="gradient-title mt-8 font-display text-6xl font-extrabold">
            StartupSense-AI
          </h1>

          <p className="mt-5 text-lg leading-8 text-secondary">
            Login to your AI startup validation command center and continue
            analyzing ideas, reports, dashboards, and insights.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Mini label="AI" value="Gemini" />
            <Mini label="Backend" value="FastAPI" />
            <Mini label="Database" value="MongoDB" />
          </div>
        </section>

        {mode === "forgot" ? (
          <form onSubmit={resetPassword} className="glass-card p-8">
            <h2 className="font-display text-4xl font-extrabold text-primary">
              Reset Password
            </h2>
            <p className="mt-2 text-secondary">
              Enter your registered email and create a new password.
            </p>

            <div className="mt-8 space-y-4">
              <Input
                icon={Mail}
                type="email"
                placeholder="Registered email address"
                value={resetEmail}
                onChange={setResetEmail}
              />

              <Input
                icon={Lock}
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 font-extrabold text-white">
                Reset Password
              </button>
            </div>

            <p className="mt-6 text-center text-secondary">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-bold text-[color:var(--accent-blue)]"
              >
                Back to Login
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={submit} className="glass-card p-8">
            <h2 className="font-display text-4xl font-extrabold text-primary">
              Welcome Back
            </h2>
            <p className="mt-2 text-secondary">
              Enter your account details to continue.
            </p>

            <div className="mt-8 space-y-4">
              <Input
                icon={Mail}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={setEmail}
              />

              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm font-bold text-[color:var(--accent-blue)]"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                disabled={authLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 font-extrabold text-white disabled:opacity-50"
              >
                {authLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="mt-6 text-center text-secondary">
              New to StartupSense-AI?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-bold text-[color:var(--accent-blue)]"
              >
                Create account
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border px-4 py-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="h-5 w-5 text-[color:var(--accent-blue)]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-primary outline-none placeholder:text-secondary"
      />
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="text-xs font-bold uppercase text-secondary">{label}</p>
      <p className="mt-1 font-bold text-primary">{value}</p>
    </div>
  );
}