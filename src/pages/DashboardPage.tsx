import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import SearchInput from "../components/common/SearchInput";
import FilterBar from "../components/investigation/FilterBar";
import DetailPanel from "../components/investigation/DetailPanel";
import PersonList from "../components/investigation/PersonList";
import RecordTimeline from "../components/investigation/RecordTimeline";
import AppShell from "../components/layout/AppShell";
import Panel from "../components/layout/Panel";
import { fetchInvestigationData } from "../lib/api";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "High Risk", value: "high-risk" },
  { label: "Medium Risk", value: "medium-risk" },
  { label: "Recently Seen", value: "recent" },
];

function DashboardPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["investigation-data"],
    queryFn: fetchInvestigationData,
  });

  const people = data?.people ?? [];
  const records = data?.records ?? [];
  const summary = data?.summary ?? null;

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
  }, [people, search, activeFilter]);

  const effectiveSelectedPersonId =
    selectedPersonId ?? filteredPeople[0]?.id ?? people[0]?.id ?? null;

  const selectedPerson =
    filteredPeople.find((person) => person.id === effectiveSelectedPersonId) ??
    people.find((person) => person.id === effectiveSelectedPersonId) ??
    null;

  const relatedRecords = useMemo(() => {
    if (!effectiveSelectedPersonId) return [];

    return records.filter((record) =>
      record.personIds.includes(effectiveSelectedPersonId),
    );
  }, [records, effectiveSelectedPersonId]);

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
            {isLoading ? (
              <LoadingState lines={4} />
            ) : isError ? (
              <ErrorState description="Failed to load people records." />
            ) : (
              <PersonList
                people={filteredPeople}
                selectedPersonId={effectiveSelectedPersonId}
                onSelectPerson={setSelectedPersonId}
              />
            )}
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel title="Timeline">
            {isLoading ? (
              <LoadingState lines={5} />
            ) : isError ? (
              <ErrorState description="Failed to load timeline records." />
            ) : selectedPerson ? (
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
              {isLoading ? (
                <LoadingState lines={2} />
              ) : isError ? (
                <ErrorState description="Failed to load investigation summary." />
              ) : summary ? (
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
              ) : (
                <EmptyState
                  title="No summary available"
                  description="Summary insights will appear here when data is ready."
                />
              )}
            </Panel>

            <Panel title="Details">
              {isLoading ? (
                <LoadingState lines={3} />
              ) : isError ? (
                <ErrorState description="Failed to load selected person details." />
              ) : (
                <DetailPanel
                  person={selectedPerson}
                  relatedRecords={relatedRecords}
                />
              )}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default DashboardPage;
