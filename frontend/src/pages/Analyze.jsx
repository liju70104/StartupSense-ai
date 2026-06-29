import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Brain,
  CheckCircle2,
  Loader2,
  Rocket,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = "https://startupsense-ai-backend.onrender.com";

const initialForm = {
  startup_name: "",
  industry: "Artificial Intelligence",
  problem: "",
  solution: "",
  target_audience: "",
  revenue_model: "",
  competitors: "",
};

export default function Analyze() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const steps = [
    { title: "Startup Identity", icon: Rocket, fields: ["startup_name", "industry"] },
    { title: "Problem & Solution", icon: Brain, fields: ["problem", "solution"] },
    { title: "Market & Money", icon: Wallet, fields: ["target_audience", "revenue_model", "competitors"] },
  ];

  const current = steps[step];

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = current.fields.every((field) => form[field]?.trim());

  const submitAnalysis = async () => {
    if (!user?.email) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_email: user.email }),
      });

      const data = await res.json();

      if (data.success) {
        setAnalysis(data.analysis);
        toast.success("Startup analyzed successfully");

        queryClient.invalidateQueries({ queryKey: ["dashboard", user.email] });
        queryClient.invalidateQueries({ queryKey: ["history", user.email] });
      } else {
        setError(data.message || "Analysis failed.");
        toast.error(data.message || "Analysis failed");
      }
    } catch {
      setError("Backend not connected or analysis failed.");
      toast.error("Backend not connected");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const file = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.startup_name || "startup"}_analysis_report.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Report downloaded");
  };

  const scoreData = analysis
    ? [
        { name: "Innovation", value: analysis.innovation_score || 0 },
        { name: "Market", value: analysis.market_score || 0 },
        { name: "Revenue", value: analysis.revenue_score || 0 },
        { name: "Competition", value: analysis.competition_score || 0 },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section
        className="rounded-[36px] border p-10"
        style={{
          borderColor: "var(--border)",
          background: "linear-gradient(135deg, var(--card-strong), var(--card))",
        }}
      >
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold text-secondary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Sparkles className="h-4 w-4 text-[color:var(--accent-blue)]" />
          AI-powered idea validation
        </p>

        <h1 className="gradient-title max-w-4xl font-display text-6xl font-extrabold tracking-tight">
          Analyze Your Startup Idea
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Use a guided startup validation flow to generate AI scores, risk level,
          recommendations, and report-ready business insights.
        </p>

        <p className="mt-4 text-sm text-secondary">
          Logged in as: <span className="font-bold text-primary">{user?.email}</span>
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="glass-card space-y-4 p-6">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const completed = index < step;

              return (
                <button
                  key={item.title}
                  onClick={() => setStep(index)}
                  className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-1"
                  style={{
                    borderColor: active ? "var(--accent-blue)" : "var(--border)",
                    background: active ? "var(--card-strong)" : "var(--card)",
                  }}
                >
                  <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-3">
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{item.title}</p>
                    <p className="text-sm text-secondary">
                      Step {index + 1} of {steps.length}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.35 }}
            className="glass-card p-7"
          >
            <h2 className="font-display text-3xl font-extrabold text-primary">
              {current.title}
            </h2>

            <p className="mt-2 text-secondary">
              Fill the details carefully. Stronger inputs produce better AI validation results.
            </p>

            <div className="mt-6 space-y-5">
              {step === 0 && (
                <>
                  <Field
                    label="Startup Name"
                    value={form.startup_name}
                    onChange={(e) => update("startup_name", e.target.value)}
                    placeholder="Example: SkillBridge AI"
                  />

                  <div>
                    <label className="mb-2 block font-bold text-primary">
                      Industry
                    </label>
                    <select
                      value={form.industry}
                      onChange={(e) => update("industry", e.target.value)}
                      className="w-full rounded-2xl border px-4 py-4 outline-none"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--card)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <option>Artificial Intelligence</option>
                      <option>FinTech</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>E-Commerce</option>
                      <option>Cybersecurity</option>
                      <option>Social Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <TextArea
                    label="Problem Statement"
                    value={form.problem}
                    onChange={(e) => update("problem", e.target.value)}
                    placeholder="What problem are you solving?"
                  />

                  <TextArea
                    label="Your Solution"
                    value={form.solution}
                    onChange={(e) => update("solution", e.target.value)}
                    placeholder="How does your startup solve this problem?"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <Field
                    label="Target Audience"
                    value={form.target_audience}
                    onChange={(e) => update("target_audience", e.target.value)}
                    placeholder="College students, founders, small businesses..."
                  />

                  <Field
                    label="Revenue Model"
                    value={form.revenue_model}
                    onChange={(e) => update("revenue_model", e.target.value)}
                    placeholder="Subscription, freemium, commission..."
                  />

                  <TextArea
                    label="Competitors"
                    value={form.competitors}
                    onChange={(e) => update("competitors", e.target.value)}
                    placeholder="Mention competitors or alternatives."
                  />
                </>
              )}
            </div>

            <div className="mt-7 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-2xl border px-5 py-3 font-bold text-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  Back
                </button>
              )}

              {step < steps.length - 1 ? (
                <button
                  disabled={!isStepValid}
                  onClick={() => setStep(step + 1)}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-extrabold text-white disabled:opacity-40"
                >
                  Continue
                </button>
              ) : (
                <button
                  disabled={!isStepValid || loading}
                  onClick={submitAnalysis}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-extrabold text-white disabled:opacity-40"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? "AI is analyzing..." : "Analyze Startup"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {error && (
        <div className="glass-card border-red-400/40 p-5 text-red-400">
          {error}
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <ResultCard label="Overall Score" value={analysis.overall_score} />
            <ResultCard label="Status" value={analysis.status} />
            <ResultCard label="Risk Level" value={analysis.risk_level} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="font-display text-2xl font-extrabold text-primary">
                Score Breakdown
              </h3>

              <div className="mt-5 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData}>
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-2xl font-extrabold text-primary">
                AI Recommendation
              </h3>

              <p className="mt-4 text-secondary">
                {analysis.recommendation || "No recommendation available."}
              </p>

              <h3 className="mt-6 font-display text-2xl font-extrabold text-primary">
                AI Business Analysis
              </h3>

              <p className="mt-4 whitespace-pre-line text-secondary">
                {analysis.ai_analysis || "AI analysis not available."}
              </p>

              <button
                onClick={downloadReport}
                className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-extrabold text-white"
              >
                Download Report
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-bold text-primary">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-4 outline-none"
        style={{
          borderColor: "var(--border)",
          background: "var(--card)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-bold text-primary">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="5"
        className="w-full rounded-2xl border px-4 py-4 outline-none"
        style={{
          borderColor: "var(--border)",
          background: "var(--card)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm font-extrabold uppercase tracking-wider text-secondary">
        {label}
      </p>
      <p className="mt-3 font-mono text-4xl font-bold text-[color:var(--accent-blue)]">
        {value || "N/A"}
      </p>
    </div>
  );
}