type PanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {title ? (
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </h2>
        </div>
      ) : null}

      <div className="p-4">{children}</div>
    </section>
  );
}

export default Panel;
