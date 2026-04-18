import type { Person, TimelineRecord } from "../../types/investigation";
import EmptyState from "../common/EmptyState";

type DetailPanelProps = {
  person: Person | null;
  relatedRecords: TimelineRecord[];
};

function DetailPanel({ person, relatedRecords }: DetailPanelProps) {
  if (!person) {
    return (
      <EmptyState
        title="No person selected"
        description="Select a person to inspect their linked records and details."
      />
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Selected Person
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {person.name}
        </h3>
        <p className="mt-1 text-slate-600">{person.note}</p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Risk Level
        </p>
        <p className="mt-1 capitalize text-slate-800">{person.riskLevel}</p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Last Seen
        </p>
        <p className="mt-1 text-slate-800">{person.lastSeen ?? "Unknown"}</p>
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Linked Records
        </p>
        <p className="mt-1 text-slate-800">{relatedRecords.length}</p>
      </div>
    </div>
  );
}

export default DetailPanel;
