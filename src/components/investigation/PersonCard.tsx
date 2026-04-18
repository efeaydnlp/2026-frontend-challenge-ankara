import type { DashboardPerson } from "../../types/investigation";

type PersonCardProps = {
  person: DashboardPerson;
  isSelected: boolean;
  onClick: () => void;
};

function PersonCard({ person, isSelected, onClick }: PersonCardProps) {
  const riskColor =
    person.riskLevel === "high"
      ? "bg-red-50 text-red-700"
      : person.riskLevel === "medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${
        isSelected
          ? "border-slate-900 bg-slate-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{person.name}</p>
          <p className="mt-1 text-sm text-slate-500">{person.note}</p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${riskColor}`}
        >
          {person.riskLevel}
        </span>
      </div>

      {person.lastSeen ? (
        <p className="mt-3 text-xs text-slate-400">
          Last seen: {person.lastSeen}
        </p>
      ) : null}
    </button>
  );
}

export default PersonCard;
