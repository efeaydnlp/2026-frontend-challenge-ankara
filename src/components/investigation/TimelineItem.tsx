import type { UnifiedRecord } from "../../types/investigation";

const typeStyles: Record<string, string> = {
  message: "bg-sky-50 text-sky-700",
  checkin: "bg-emerald-50 text-emerald-700",
  sighting: "bg-amber-50 text-amber-700",
  note: "bg-violet-50 text-violet-700",
  tip: "bg-rose-50 text-rose-700",
};

type TimelineItemProps = {
  record: UnifiedRecord;
};

function TimelineItem({ record }: TimelineItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase ${
          typeStyles[record.type] ?? "bg-slate-100 text-slate-700"
        }`}
      >
        {record.type}
      </p>
      <p className="mt-1 font-medium text-slate-900">{record.title}</p>
      <p className="mt-2 text-sm text-slate-600">{record.content}</p>
      <p className="mt-2 text-sm text-slate-500">
        {record.location ? `${record.location} · ` : ""}
        {record.timestamp ?? ""}
      </p>
    </div>
  );
}

export default TimelineItem;
