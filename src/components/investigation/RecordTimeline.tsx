import type { TimelineRecord } from "../../types/investigation";
import EmptyState from "../common/EmptyState";
import TimelineItem from "./TimelineItem";

type RecordTimelineProps = {
  records: TimelineRecord[];
};

function RecordTimeline({ records }: RecordTimelineProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No records found"
        description="There are no linked records for the current selection."
      />
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <TimelineItem key={record.id} record={record} />
      ))}
    </div>
  );
}

export default RecordTimeline;
