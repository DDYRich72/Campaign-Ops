interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-rule px-6 py-16 text-center bg-paper">
      <p className="editorial-eyebrow mb-4">A blank page</p>
      <h3 className="font-display text-[22px] text-ink tracking-tight">{title}</h3>
      <p className="mt-3 text-[13px] text-ink-soft max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
