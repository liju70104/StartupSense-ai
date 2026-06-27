import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register({ setMode }) {
  const { register, authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) return;

    const ok = await register(name, email, password);

    if (ok) {
      setMode("login");
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-6 py-10 text-primary">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.20),transparent_30%)]" />

      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center">
        <form onSubmit={submit} className="glass-card w-full p-8">
          <h2 className="gradient-title font-display text-5xl font-extrabold">
            Create Account
          </h2>

          <p className="mt-3 text-secondary">
            Start validating startup ideas with AI.
          </p>

          <div className="mt-8 space-y-4">
            <Input icon={User} type="text" placeholder="Full Name" value={name} onChange={setName} />
            <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} />
            <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />

            <button
              disabled={authLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 font-extrabold text-white disabled:opacity-50"
            >
              {authLoading ? "Creating..." : "Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-secondary">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-bold text-[color:var(--accent-blue)]"
            >
              Login
            </button>
          </p>
        </form>
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