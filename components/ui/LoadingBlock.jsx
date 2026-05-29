export default function LoadingBlock({ lines = 3, className = "" }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-fl-bg3"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
