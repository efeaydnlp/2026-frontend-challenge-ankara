type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
};

function FilterBar({ options, activeValue, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
