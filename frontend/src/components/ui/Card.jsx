export default function Card({ title, children, className = "" }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {title && (
        <h3 className="font-display text-2xl font-extrabold text-primary">
          {title}
        </h3>
      )}
      <div className="mt-4 text-secondary">{children}</div>
    </div>
  );
}