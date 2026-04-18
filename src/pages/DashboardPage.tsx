import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import Panel from "../components/layout/Panel";
import SearchInput from "../components/common/SearchInput";
import FilterBar from "../components/investigation/FilterBar";

const people = [
  {
    id: "1",
    name: "Ayşe Kaya",
    note: "Last seen near Kızılay",
  },
  {
    id: "2",
    name: "Mert Demir",
    note: "Mentioned in anonymous tip",
  },
  {
    id: "3",
    name: "Selin Aras",
    note: "Linked to two sightings",
  },
];

const filterOptions = [
  { label: "All", value: "all" },
  { label: "High Risk", value: "high-risk" },
  { label: "Recently Seen", value: "recent" },
  { label: "Mentioned", value: "mentioned" },
];

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPeople = useMemo(() => {
    return people.filter((person) =>
      `${person.name} ${person.note}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <AppShell>
      <div className="mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Investigation Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Missing Podo: The Ankara Case
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Analyze linked records, inspect sightings, and identify who looks
            more suspicious based on the incoming data sources.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by person, clue, or note..."
        />

        <FilterBar
          options={filterOptions}
          activeValue={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <Panel title="People">
            <div className="space-y-3">
              {filteredPeople.map((person) => (
                <div
                  key={person.id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-slate-500">{person.note}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel title="Timeline">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Sighting
                </p>
                <p className="mt-1 font-medium">Podo seen with Ayşe Kaya</p>
                <p className="mt-1 text-sm text-slate-600">
                  Kuğulu Park · 14:10
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Message
                </p>
                <p className="mt-1 font-medium">
                  “Did you still have the cat with you?”
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Related to Mert Demir · 14:42
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Check-in
                </p>
                <p className="mt-1 font-medium">
                  Selin Aras checked in at Tunalı
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Tunalı Hilmi · 15:05
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <div className="space-y-4">
            <Panel title="Summary">
              <div className="space-y-3 text-sm">
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="font-semibold text-amber-800">
                    Most suspicious
                  </p>
                  <p className="mt-1 text-amber-700">Mert Demir</p>
                </div>

                <div className="rounded-xl bg-sky-50 p-3">
                  <p className="font-semibold text-sky-800">Last seen with</p>
                  <p className="mt-1 text-sky-700">Ayşe Kaya</p>
                </div>
              </div>
            </Panel>

            <Panel title="Details">
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  Select a person or record to inspect linked messages,
                  sightings, notes, and tips.
                </p>
                <p>
                  This panel will later show record relationships and reasoning.
                </p>
                <p className="pt-2 text-xs uppercase tracking-wide text-slate-400">
                  Active filter: {activeFilter}
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default DashboardPage;
