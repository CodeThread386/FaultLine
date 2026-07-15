export default function EmptyState({ icon = "—", title, description }) {
  return (
    <div className="fl-fade-in rounded-sm border border-dashed border-fl-border bg-fl-bg2/80 px-6 py-12 text-center backdrop-blur-sm">
      <div className="mb-3 font-display text-4xl text-fl-muted">{icon}</div>
      <div className="font-semibold">{title}</div>
      {description && <p className="mt-2 text-sm leading-relaxed text-fl-muted">{description}</p>}
    </div>
  );
}
