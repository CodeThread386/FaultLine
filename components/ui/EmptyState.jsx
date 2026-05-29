export default function EmptyState({ icon = "—", title, description }) {
  return (
    <div className="fl-fade-in rounded-lg border border-dashed border-fl-border bg-fl-bg2 px-6 py-10 text-center">
      <div className="mb-2 text-3xl">{icon}</div>
      <div className="font-semibold">{title}</div>
      {description && <p className="mt-2 text-sm text-fl-muted">{description}</p>}
    </div>
  );
}
