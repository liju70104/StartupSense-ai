import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  RefreshCcw,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export default function History() {
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/history`);
      const data = await res.json();

      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (error) {
      console.log("History load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    let items = [...history];

    if (query.trim()) {
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortBy === "score") {
      items.sort(
        (a, b) =>
          Number(b.overall_score || b.score || 0) -
          Number(a.overall_score || a.score || 0)
      );
    }

    if (sortBy === "latest") {
      items.sort((a, b) =>
        String(b.created_at || "").localeCompare(String(a.created_at || ""))
      );
    }

    return items;
  }, [history, query, sortBy]);

  const exportCSV = () => {
    const headers = [
      "Startup Name",
      "Industry",
      "Score",
      "Risk Level",
      "Status",
      "Created At",
    ];

    const rows = filteredHistory.map((item) => [
      item.startup_name || item.name || "Startup Idea",
      item.industry || "N/A",
      item.overall_score || item.score || "N/A",
      item.risk_level || "N/A",
      item.status || "N/A",
      item.created_at || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const file = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "startup_history.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold text-secondary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Clock className="h-4 w-4 text-[color:var(--accent-blue)]" />
          MongoDB analysis records
        </p>

        <h1 className="gradient-title font-display text-6xl font-extrabold tracking-tight">
          Startup History
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
          Search, sort, review, and export all startup ideas analyzed through
          StartupSense-AI.
        </p>
      </motion.section>

      <div className="glass-card grid gap-4 p-5 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border px-4 py-3 md:col-span-2"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <Search className="h-5 w-5 text-[color:var(--accent-blue)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search startup name, industry, score, risk..."
            className="w-full bg-transparent text-primary outline-none placeholder:text-secondary"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-2xl border px-4 py-3 text-primary outline-none"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <option value="latest">Sort by latest</option>
          <option value="score">Sort by score</option>
        </select>

        <button
          onClick={loadHistory}
          className="rounded-2xl border px-5 py-3 font-extrabold text-primary"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <RefreshCcw className="mr-2 inline h-4 w-4" />
          Refresh
        </button>

        <button
          onClick={exportCSV}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-extrabold text-white"
        >
          <Download className="mr-2 inline h-4 w-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass-card h-44 animate-pulse" />
          <div className="glass-card h-44 animate-pulse" />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-card p-8">
          <h3 className="font-display text-2xl font-extrabold text-primary">
            No history found
          </h3>
          <p className="mt-3 text-secondary">
            Analyze a startup idea first or try clearing the search.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredHistory.map((item, index) => (
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
                    {item.startup_name || item.name || "Startup Idea"}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">
                    {item.industry || "Industry not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-mono font-bold text-white">
                  {item.overall_score || item.score || "N/A"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Mini label="Risk" value={item.risk_level || "N/A"} />
                <Mini label="Status" value={item.status || "N/A"} />
                <Mini label="Created" value={item.created_at || "N/A"} />
                <Mini label="Source" value="MongoDB" />
              </div>

              <div className="mt-5 rounded-2xl border p-4"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <p className="flex items-center gap-2 font-bold text-primary">
                  <Sparkles className="h-4 w-4 text-[color:var(--accent-blue)]" />
                  AI Summary
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-secondary">
                  {item.recommendation ||
                    item.ai_analysis ||
                    "Analysis stored successfully."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="glass-card p-6">
        <p className="flex items-center gap-2 font-bold text-primary">
          <TrendingUp className="h-5 w-5 text-[color:var(--accent-blue)]" />
          History module is live
        </p>
        <p className="mt-2 text-secondary">
          This page is connected to your real `/history` API and displays records
          from MongoDB Atlas.
        </p>
      </div>
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