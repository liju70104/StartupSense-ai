import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Printer,
  Share2,
  Sparkles,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export default function Reports() {
  const [history, setHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHistory(data.history || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = history[selectedIndex];

  const downloadReport = () => {
    if (!selected) return;

    const report = `
STARTUPSENSE-AI STARTUP VALIDATION REPORT

Startup Name: ${selected.startup_name || "Startup Idea"}
Industry: ${selected.industry || "N/A"}
Overall Score: ${selected.overall_score || selected.score || "N/A"}
Risk Level: ${selected.risk_level || "N/A"}
Status: ${selected.status || "N/A"}
Created At: ${selected.created_at || "N/A"}

Recommendation:
${selected.recommendation || "No recommendation available."}

AI Analysis:
${selected.ai_analysis || "No AI analysis available."}
`;

    const file = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "startup_validation_report.txt";
    link.click();
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold text-secondary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <FileText className="h-4 w-4 text-[color:var(--accent-blue)]" />
          Report generator
        </p>

        <h1 className="gradient-title font-display text-6xl font-extrabold tracking-tight">
          Reports Center
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Generate report-ready startup validation summaries from real MongoDB
          analysis records.
        </p>
      </motion.section>

      {loading ? (
        <div className="glass-card h-56 animate-pulse" />
      ) : history.length === 0 ? (
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-extrabold text-primary">
            No reports available
          </h3>
          <p className="mt-3 text-secondary">
            Analyze a startup idea first. Reports are generated from saved
            analysis records.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="glass-card space-y-3 p-5">
              <h3 className="font-display text-2xl font-extrabold text-primary">
                Select Analysis
              </h3>

              {history.map((item, index) => (
                <button
                  key={item._id || index}
                  onClick={() => setSelectedIndex(index)}
                  className="w-full rounded-2xl border p-4 text-left transition hover:-translate-y-1"
                  style={{
                    borderColor:
                      selectedIndex === index
                        ? "var(--accent-blue)"
                        : "var(--border)",
                    background: "var(--card)",
                  }}
                >
                  <p className="font-bold text-primary">
                    {item.startup_name || "Startup Idea"}
                  </p>
                  <p className="text-sm text-secondary">
                    Score: {item.overall_score || item.score || "N/A"} •{" "}
                    {item.created_at || "N/A"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-8">
            <div className="glass-card p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-4xl font-extrabold text-primary">
                    {selected?.startup_name || "Startup Report"}
                  </h2>
                  <p className="mt-2 text-secondary">
                    {selected?.industry || "Industry not specified"}
                  </p>
                </div>

                <button
                  onClick={downloadReport}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-extrabold text-white"
                >
                  <Download className="mr-2 inline h-4 w-4" />
                  Download
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Mini icon={BarChart3} label="Score" value={selected?.overall_score || selected?.score || "N/A"} />
                <Mini icon={ShieldAlert} label="Risk" value={selected?.risk_level || "N/A"} />
                <Mini icon={CheckCircle2} label="Status" value={selected?.status || "N/A"} />
              </div>

              <div className="mt-6 rounded-3xl border p-6"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <h3 className="font-display text-2xl font-extrabold text-primary">
                  Executive Summary
                </h3>
                <p className="mt-4 text-secondary">
                  {selected?.recommendation ||
                    "This report summarizes the startup validation result based on AI scoring, market fit, risk, and business feasibility."}
                </p>
              </div>

              <div className="mt-6 rounded-3xl border p-6"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <h3 className="flex items-center gap-2 font-display text-2xl font-extrabold text-primary">
                  <Sparkles className="h-5 w-5 text-[color:var(--accent-blue)]" />
                  AI Business Analysis
                </h3>
                <p className="mt-4 whitespace-pre-line text-secondary">
                  {selected?.ai_analysis || "No AI analysis available."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="rounded-2xl border px-5 py-3 font-bold text-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Printer className="mr-2 inline h-4 w-4" />
                  Print
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="rounded-2xl border px-5 py-3 font-bold text-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Share2 className="mr-2 inline h-4 w-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({ icon: Icon, label, value }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Icon className="h-5 w-5 text-[color:var(--accent-blue)]" />
      <p className="mt-3 text-xs font-extrabold uppercase tracking-widest text-secondary">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}