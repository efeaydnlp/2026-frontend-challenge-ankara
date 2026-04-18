import type { TimelineRecord } from "../../types/investigation";

type TimelineItemProps = {
  record: TimelineRecord;
};

function TimelineItem({ record }: TimelineItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {record.type}
      </p>
      <p className="mt-1 font-medium text-slate-900">{record.title}</p>
      <p className="mt-2 text-sm text-slate-600">{record.description}</p>
      <p className="mt-2 text-sm text-slate-500">
        {record.location ? `${record.location} · ` : ""}
        {record.timestamp}
      </p>
    </div>
  );
}

export default TimelineItem;
