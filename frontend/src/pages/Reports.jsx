import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BarChart3,
  Download,
  FileJson,
  FileText,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "../context/AuthContext.jsx";
import { useDashboard } from "../hooks/useDashboard.js";
import { useHistory } from "../hooks/useHistory.js";

export default function Reports() {
  const { user } = useAuth();
  const email = user?.email || "";

  const { data: dashboard } = useDashboard(email);
  const { data: historyData, isLoading, refetch } = useHistory(email);

  const reports = historyData?.history || [];

  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [selected, setSelected] = useState(null);

  const filteredReports = useMemo(() => {
    let items = [...reports];

    if (query.trim()) {
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      );
    }

    if (riskFilter !== "All") {
      items = items.filter((item) =>
        String(item.risk_level || "").toLowerCase().includes(riskFilter.toLowerCase())
      );
    }

    if (sortBy === "score") {
      items.sort(
        (a, b) =>
          Number(b.overall_score || 0) - Number(a.overall_score || 0)
      );
    }

    if (sortBy === "latest") {
      items.sort((a, b) =>
        String(b.created_at || "").localeCompare(String(a.created_at || ""))
      );
    }

    return items;
  }, [reports, query, riskFilter, sortBy]);

  const chartData = filteredReports.map((item) => ({
    name: item.startup_name || "Idea",
    score: Number(item.overall_score || 0),
  }));

  const bestReport = [...reports].sort(
    (a, b) => Number(b.overall_score || 0) - Number(a.overall_score || 0)
  )[0];

  const exportJSON = () => {
    if (filteredReports.length === 0) {
      toast.error("No reports to export");
      return;
    }

    const file = new Blob([JSON.stringify(filteredReports, null, 2)], {
      type: "application/json",
    });

    downloadFile(file, "startupsense_reports.json");
    toast.success("JSON report exported");
  };

  const exportCSV = () => {
    if (filteredReports.length === 0) {
      toast.error("No reports to export");
      return;
    }

    const headers = [
      "Startup Name",
      "Industry",
      "Score",
      "Risk Level",
      "Status",
      "Created At",
      "User Email",
    ];

    const rows = filteredReports.map((item) => [
      item.startup_name || "Startup Idea",
      item.industry || "N/A",
      item.overall_score || "N/A",
      item.risk_level || "N/A",
      item.status || "N/A",
      item.created_at || "N/A",
      item.user_email || email,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    downloadFile(new Blob([csv], { type: "text/csv" }), "startupsense_reports.csv");
    toast.success("CSV report exported");
  };

  const downloadTextReport = (item) => {
    const report = `
STARTUPSENSE-AI STARTUP REPORT

User: ${email}

Startup Name: ${item.startup_name || "Startup Idea"}
Industry: ${item.industry || "N/A"}
Overall Score: ${item.overall_score || "N/A"}
Risk Level: ${item.risk_level || "N/A"}
Status: ${item.status || "N/A"}
Created At: ${item.created_at || "N/A"}

Recommendation:
${item.recommendation || "No recommendation available."}

AI Business Analysis:
${item.ai_analysis || "AI analysis not available."}
`;

    downloadFile(
      new Blob([report], { type: "text/plain" }),
      `${item.startup_name || "startup"}_report.txt`
    );

    toast.success("Report downloaded");
  };

  const refreshReports = async () => {
    await refetch();
    toast.success("Reports refreshed");
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
          User-specific report center
        </p>

        <h1 className="gradient-title font-display text-6xl font-extrabold">
          Reports Center
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Generate, search, export, print, and review startup validation reports from your saved AI analyses.
        </p>

        <p className="mt-3 text-sm text-secondary">
          Showing reports for: <span className="font-bold text-primary">{email}</span>
        </p>
      </motion.section>

      <div className="grid gap-5 md:grid-cols-4">
        <Stat icon={FileText} label="Total Reports" value={reports.length} />
        <Stat icon={BarChart3} label="Average Score" value={dashboard?.average_score || 0} />
        <Stat icon={Trophy} label="Highest Score" value={dashboard?.highest_score || 0} />
        <Stat icon={ShieldAlert} label="Best Startup" value={bestReport?.startup_name || "N/A"} />
      </div>

      <div className="glass-card grid gap-4 p-5 md:grid-cols-4">
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-3 md:col-span-2"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Search className="h-5 w-5 text-[color:var(--accent-blue)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search report, startup, industry, score..."
            className="w-full bg-transparent text-primary outline-none placeholder:text-secondary"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="rounded-2xl border px-4 py-3 text-primary outline-none"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-2xl border px-4 py-3 text-primary outline-none"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <option value="latest">Latest</option>
          <option value="score">Highest Score</option>
        </select>

        <button
          onClick={refreshReports}
          className="rounded-2xl border px-5 py-3 font-extrabold text-primary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          Refresh
        </button>

        <button
          onClick={exportJSON}
          className="rounded-2xl border px-5 py-3 font-extrabold text-primary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <FileJson className="mr-2 inline h-4 w-4" />
          JSON
        </button>

        <button
          onClick={exportCSV}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-extrabold text-white"
        >
          <Download className="mr-2 inline h-4 w-4" />
          CSV
        </button>

        <button
          onClick={() => window.print()}
          className="rounded-2xl border px-5 py-3 font-extrabold text-primary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Printer className="mr-2 inline h-4 w-4" />
          Print
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-extrabold text-primary">
            Score Analytics
          </h3>

          <div className="mt-5 h-80">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-secondary">
                No report data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#38bdf8" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-display text-2xl font-extrabold text-primary">
            AI Report Insights
          </h3>

          <div className="mt-5 space-y-3">
            <Mini label="Best Startup" value={bestReport?.startup_name || "N/A"} />
            <Mini label="Best Score" value={bestReport?.overall_score || "N/A"} />
            <Mini label="Latest Report" value={reports[0]?.startup_name || "N/A"} />
            <Mini label="Total User Reports" value={reports.length} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-card h-56 animate-pulse" />
          <div className="glass-card h-56 animate-pulse" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-extrabold text-primary">
            No reports found
          </h3>
          <p className="mt-3 text-secondary">
            Analyze a startup idea first to generate report data.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredReports.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-primary">
                    {item.startup_name || "Startup Idea"}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">
                    {item.industry || "Industry not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-mono font-bold text-white">
                  {item.overall_score || "N/A"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Mini label="Risk" value={item.risk_level || "N/A"} />
                <Mini label="Status" value={item.status || "N/A"} />
                <Mini label="Created" value={item.created_at || "N/A"} />
                <Mini label="User" value={item.user_email || email} />
              </div>

              <div
                className="mt-5 rounded-2xl border p-4"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <p className="flex items-center gap-2 font-bold text-primary">
                  <Sparkles className="h-4 w-4 text-[color:var(--accent-blue)]" />
                  AI Summary
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-secondary">
                  {item.recommendation || item.ai_analysis || "Report generated successfully."}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => setSelected(item)}
                  className="rounded-2xl border px-5 py-3 font-bold text-primary"
                  style={{ borderColor: "var(--border)" }}
                >
                  Open Report
                </button>

                <button
                  onClick={() => downloadTextReport(item)}
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-white"
                >
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
          <div className="glass-card max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="font-display text-4xl font-extrabold text-primary">
                  {selected.startup_name || "Startup Report"}
                </h2>
                <p className="mt-2 text-secondary">
                  {selected.industry || "Industry not specified"} • {selected.created_at || "N/A"}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-2xl border px-4 py-2 font-bold text-primary"
                style={{ borderColor: "var(--border)" }}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Mini label="Overall Score" value={selected.overall_score || "N/A"} />
              <Mini label="Risk Level" value={selected.risk_level || "N/A"} />
              <Mini label="Status" value={selected.status || "N/A"} />
            </div>

            <div
              className="mt-6 rounded-3xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <h3 className="font-display text-2xl font-extrabold text-primary">
                Recommendation
              </h3>
              <p className="mt-3 whitespace-pre-line text-secondary">
                {selected.recommendation || "No recommendation available."}
              </p>
            </div>

            <div
              className="mt-6 rounded-3xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <h3 className="font-display text-2xl font-extrabold text-primary">
                AI Business Analysis
              </h3>
              <p className="mt-3 whitespace-pre-line text-secondary">
                {selected.ai_analysis || "AI analysis not available."}
              </p>
            </div>

            <button
              onClick={() => downloadTextReport(selected)}
              className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-extrabold text-white"
            >
              Download Full Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="glass-card p-6">
      <Icon className="h-6 w-6 text-[color:var(--accent-blue)]" />
      <p className="mt-4 text-xs font-extrabold uppercase text-secondary">{label}</p>
      <p className="mt-2 break-words font-mono text-3xl font-bold text-[color:var(--accent-blue)]">
        {value}
      </p>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-primary">{value}</p>
    </div>
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