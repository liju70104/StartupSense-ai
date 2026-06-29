import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Brain,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Flame,
  Globe2,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "https://startupsense-ai-backend.onrender.com";

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.07, duration: 0.42 },
  }),
};

export default function Dashboard({ setActiveTab }) {
  const { user } = useAuth();
  const email = user?.email || "";

  const [stats, setStats] = useState({
    total_ideas: 0,
    average_score: 0,
    highest_score: 0,
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!email) return;

    setLoading(true);

    try {
      const [dashboardData, historyData] = await Promise.all([
        fetch(`${API_URL}/dashboard?email=${email}`).then((res) => res.json()),
        fetch(`${API_URL}/history?email=${email}`).then((res) => res.json()),
      ]);

      if (dashboardData.success) {
        setStats(dashboardData);
      }

      if (historyData.success) {
        setHistory(historyData.history || []);
      }
    } catch {
      setStats({
        total_ideas: 0,
        average_score: 0,
        highest_score: 0,
      });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [email]);

  const successRate = stats.total_ideas
    ? Math.min(100, Math.round(stats.average_score))
    : 0;

  const chartData = useMemo(
    () => [
      { name: "Ideas", value: stats.total_ideas },
      { name: "Avg Score", value: stats.average_score },
      { name: "Best Score", value: stats.highest_score },
      { name: "Success", value: successRate },
    ],
    [stats, successRate]
  );

  const topIndustry = useMemo(() => {
    const count = {};

    history.forEach((item) => {
      const industry = item.industry || "General";
      count[industry] = (count[industry] || 0) + 1;
    });

    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "Not available";
  }, [history]);

  const latestIdea = history[0];

  const trendData = useMemo(() => {
    if (history.length === 0) {
      return [
        { month: "Jan", score: 0 },
        { month: "Feb", score: 0 },
        { month: "Mar", score: 0 },
        { month: "Apr", score: 0 },
        { month: "May", score: 0 },
        { month: "Jun", score: 0 },
      ];
    }

    return history.slice(0, 6).reverse().map((item, index) => ({
      month: `Idea ${index + 1}`,
      score: Number(item.overall_score || 0),
    }));
  }, [history]);

  const pieData = [
    { name: "Ready", value: stats.highest_score || 0 },
    { name: "Improve", value: Math.max(0, 100 - Number(stats.highest_score || 0)) },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="glass-card p-10">
          <div className="h-12 w-2/3 animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-5 h-5 w-1/2 animate-pulse rounded-xl bg-white/10" />
        </section>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="glass-card h-40 animate-pulse" />
          <div className="glass-card h-40 animate-pulse" />
          <div className="glass-card h-40 animate-pulse" />
          <div className="glass-card h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-[36px] border p-10"
        style={{
          borderColor: "var(--border)",
          background:
            "linear-gradient(135deg, var(--card-strong), var(--card)), radial-gradient(circle at 85% 18%, rgba(56,189,248,0.22), transparent 30%), radial-gradient(circle at 20% 80%, rgba(139,92,246,0.20), transparent 35%)",
        }}
      >
        <div
          className="absolute right-10 top-10 hidden rounded-full border px-4 py-2 text-sm font-extrabold text-[color:var(--accent-green)] md:block"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          ● Live system
        </div>

        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold text-secondary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Sparkles className="h-4 w-4 text-[color:var(--accent-blue)]" />
          AI Startup Intelligence Platform
        </p>

        <h1 className="gradient-title max-w-4xl font-display text-6xl font-extrabold tracking-tight md:text-7xl">
          Your AI Business Command Center
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">
          Monitor your startup validation performance, track recent ideas, inspect system health,
          and get AI-powered business recommendations from one workspace.
        </p>

        <p className="mt-4 text-sm text-secondary">
          Logged in as: <span className="font-bold text-primary">{email}</span>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Pill icon={Rocket} label="Launch-ready insights" />
          <Pill icon={Brain} label="AI scoring engine" />
          <Pill icon={Database} label="MongoDB user records" />
        </div>
      </motion.section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard i={1} icon={Lightbulb} label="Total Ideas" value={stats.total_ideas} sub="Ideas analyzed by you" />
        <MetricCard i={2} icon={TrendingUp} label="Average Score" value={stats.average_score} sub="Your validation average" />
        <MetricCard i={3} icon={Flame} label="Best Score" value={stats.highest_score} sub="Your top idea performance" />
        <MetricCard i={4} icon={CheckCircle2} label="Success Rate" value={`${successRate}%`} sub="Estimated readiness" />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="xl:col-span-8">
          <Panel title="Growth intelligence" icon={Activity}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#38bdf8"
                    fill="#38bdf8"
                    fillOpacity={0.22}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="xl:col-span-4">
          <Panel title="Idea health" icon={ShieldCheck}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={72} outerRadius={108}>
                    <Cell fill="#38bdf8" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Score breakdown" icon={Zap}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Bar dataKey="value" radius={[14, 14, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="AI recommendations" icon={Brain}>
          <div className="space-y-4">
            <Insight icon={Sparkles} title="Clarify problem" text="Clear problem statements improve AI validation quality." />
            <Insight icon={TrendingUp} title="Improve revenue model" text="Add pricing, target customers, and income channels." />
            <Insight icon={Globe2} title="Market positioning" text="Mention why your solution is different from competitors." />
          </div>
        </Panel>

        <Panel title="System health" icon={ShieldCheck}>
          <div className="space-y-3">
            <Status icon={Rocket} label="Frontend" value="React active" />
            <Status icon={Database} label="Database" value="MongoDB Atlas" />
            <Status icon={Zap} label="Backend" value="Render API" />
            <Status icon={Brain} label="AI Engine" value="Ready" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Founder summary" icon={Rocket}>
          <div className="space-y-3">
            <Mini label="Latest Startup" value={latestIdea?.startup_name || "N/A"} />
            <Mini label="Top Industry" value={topIndustry} />
            <Mini label="Reports Available" value={history.length} />
            <Mini label="Account Email" value={email} />
          </div>
        </Panel>

        <div className="xl:col-span-2">
          <Panel title="Recent activity" icon={Clock}>
            {history.length === 0 ? (
              <p className="text-secondary">
                No startup ideas analyzed yet. Open the Analyze page and validate your first idea.
              </p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border p-4"
                    style={{ borderColor: "var(--border)", background: "var(--card)" }}
                  >
                    <p className="font-bold text-primary">
                      {item.startup_name || item.name || "Startup Idea"}
                    </p>
                    <p className="text-sm text-secondary">
                      Score: {item.overall_score || item.score || "N/A"} • Risk:{" "}
                      {item.risk_level || "N/A"} • {item.created_at || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      <Panel title="Quick actions" icon={Rocket}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Quick icon={Sparkles} label="Analyze new idea" onClick={() => setActiveTab("analyze")} />
          <Quick icon={FileText} label="Generate report" onClick={() => setActiveTab("reports")} />
          <Quick icon={Clock} label="Review history" onClick={() => setActiveTab("history")} />
          <Quick icon={Activity} label="Check status" onClick={() => setActiveTab("settings")} />
        </div>
      </Panel>
    </div>
  );
}

function Pill({ icon: Icon, label }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold text-secondary"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="h-4 w-4 text-[color:var(--accent-blue)]" />
      {label}
    </span>
  );
}

function MetricCard({ i, icon: Icon, label, value, sub }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={i}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-secondary">
          Live
        </span>
      </div>

      <p className="mt-5 text-sm font-extrabold uppercase tracking-wider text-secondary">
        {label}
      </p>

      <p className="mt-2 font-mono text-5xl font-bold text-[color:var(--accent-blue)]">
        {value}
      </p>

      <p className="mt-2 text-sm text-secondary">{sub}</p>
    </motion.div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-primary">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Insight({ icon: Icon, title, text }) {
  return (
    <div
      className="flex gap-3 rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="mt-1 h-5 w-5 text-[color:var(--accent-blue)]" />
      <div>
        <p className="font-bold text-primary">{title}</p>
        <p className="text-sm text-secondary">{text}</p>
      </div>
    </div>
  );
}

function Status({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border px-4 py-3"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[color:var(--accent-blue)]" />
        <span className="text-secondary">{label}</span>
      </div>
      <span className="font-bold text-[color:var(--accent-green)]">● {value}</span>
    </div>
  );
}

function Quick({ icon: Icon, label, onClick }) {
  return (
    <button
      className="flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-1"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 text-[color:var(--accent-blue)]" />
      <span className="font-bold text-primary">{label}</span>
    </button>
  );
}

function Mini({ label, value }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-2 break-words font-bold text-primary">{value}</p>
    </div>
  );
}