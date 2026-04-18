import { useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import SearchInput from "../components/common/SearchInput";
import FilterBar from "../components/investigation/FilterBar";
import DetailPanel from "../components/investigation/DetailPanel";
import PersonList from "../components/investigation/PersonList";
import RecordTimeline from "../components/investigation/RecordTimeline";
import AppShell from "../components/layout/AppShell";
import Panel from "../components/layout/Panel";
import { people, summary, timelineRecords } from "../lib/mockData";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "High Risk", value: "high-risk" },
  { label: "Medium Risk", value: "medium-risk" },
  { label: "Recently Seen", value: "recent" },
];

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(
    people[0]?.id ?? null,
  );

  const filteredPeople = useMemo(() => {
    let result = people.filter((person) =>
      `${person.name} ${person.note}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    if (activeFilter === "high-risk") {
      result = result.filter((person) => person.riskLevel === "high");
    }

    if (activeFilter === "medium-risk") {
      result = result.filter((person) => person.riskLevel === "medium");
    }

    if (activeFilter === "recent") {
      result = result.filter((person) => Boolean(person.lastSeen));
    }

    return result;
  }, [search, activeFilter]);

  const selectedPerson =
    filteredPeople.find((person) => person.id === selectedPersonId) ??
    people.find((person) => person.id === selectedPersonId) ??
    null;

  const relatedRecords = useMemo(() => {
    if (!selectedPersonId) return [];

    return timelineRecords.filter((record) =>
      record.personIds.includes(selectedPersonId),
    );
  }, [selectedPersonId]);

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
            <PersonList
              people={filteredPeople}
              selectedPersonId={selectedPersonId}
              onSelectPerson={setSelectedPersonId}
            />
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel title="Timeline">
            {selectedPerson ? (
              <RecordTimeline records={relatedRecords} />
            ) : (
              <EmptyState
                title="No selection available"
                description="Select a person from the list to inspect the timeline."
              />
            )}
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
                  <p className="mt-1 text-amber-700">
                    {summary.mostSuspicious}
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50 p-3">
                  <p className="font-semibold text-sky-800">Last seen with</p>
                  <p className="mt-1 text-sky-700">{summary.lastSeenWith}</p>
                </div>
              </div>
            </Panel>

            <Panel title="Details">
              <DetailPanel
                person={selectedPerson}
                relatedRecords={relatedRecords}
              />
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default DashboardPage;
