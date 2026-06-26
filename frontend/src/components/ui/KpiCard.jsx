export default function KpiCard({ label, value }) {
  return (
    <div className="glass-card p-6">
      <p className="text-sm font-extrabold uppercase tracking-wider text-secondary">
        {label}
      </p>

      <p className="mt-3 font-mono text-5xl font-bold text-[color:var(--accent-blue)]">
        {value}
      </p>
    </div>
  );
}