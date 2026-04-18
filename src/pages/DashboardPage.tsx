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
import { fetchAllSources } from "../lib/api";
import {
  calculateSuspiciousScore,
  extractPeople,
  getRelatedRecords,
} from "../lib/normalize";

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
    queryKey: ["all-sources"],
    queryFn: fetchAllSources,
  });

  const allRecords = useMemo(() => data ?? [], [data]);
  const allPeople = useMemo(() => extractPeople(allRecords), [allRecords]);

  const filteredPeople = useMemo(() => {
    let result = allPeople.filter((person) =>
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

    return result.sort((a, b) => {
      if (a.name === "Podo") return 1;
      if (b.name === "Podo") return -1;

      const scoreDiff =
        calculateSuspiciousScore(allRecords, b.name) -
        calculateSuspiciousScore(allRecords, a.name);

      if (scoreDiff !== 0) return scoreDiff;

      return a.name.localeCompare(b.name);
    });
  }, [allPeople, allRecords, search, activeFilter]);

  const effectiveSelectedPersonId =
    selectedPersonId ?? filteredPeople[0]?.id ?? allPeople[0]?.id ?? null;

  const selectedPerson =
    filteredPeople.find((person) => person.id === effectiveSelectedPersonId) ??
    allPeople.find((person) => person.id === effectiveSelectedPersonId) ??
    null;

  const relatedRecords = useMemo(() => {
    if (!selectedPerson) return [];
    return getRelatedRecords(allRecords, selectedPerson.name);
  }, [allRecords, selectedPerson]);

  const suspiciousScore = selectedPerson
    ? calculateSuspiciousScore(allRecords, selectedPerson.name)
    : 0;

  const topSuspicious = useMemo(() => {
    if (allPeople.length === 0) return null;

    return [...allPeople]
      .map((person) => ({
        ...person,
        score: calculateSuspiciousScore(allRecords, person.name),
      }))
      .sort((a, b) => b.score - a.score)[0];
  }, [allPeople, allRecords]);

  return (
    <AppShell>
      <div className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Investigation Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Missing Podo: The Ankara Case
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Analyze linked records, inspect sightings, and identify suspicious
          actors across multiple data sources.
        </p>
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
              <LoadingState lines={5} />
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
              <LoadingState lines={6} />
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
                <LoadingState lines={4} />
              ) : isError ? (
                <ErrorState description="Failed to load investigation summary." />
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="font-semibold text-amber-800">
                      Most suspicious
                    </p>
                    <p className="mt-1 text-amber-700">
                      {topSuspicious
                        ? `${topSuspicious.name} (${topSuspicious.score})`
                        : "Unknown"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-sky-50 p-3">
                    <p className="font-semibold text-sky-800">
                      Selected person
                    </p>
                    <p className="mt-1 text-sky-700">
                      {selectedPerson ? selectedPerson.name : "None"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-semibold text-slate-700">
                      Tracked people
                    </p>
                    <p className="mt-1 text-slate-900">{allPeople.length}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-semibold text-slate-700">
                      Total records
                    </p>
                    <p className="mt-1 text-slate-900">{allRecords.length}</p>
                  </div>
                </div>
              )}
            </Panel>

            <Panel title="Details">
              {isLoading ? (
                <LoadingState lines={4} />
              ) : isError ? (
                <ErrorState description="Failed to load selected person details." />
              ) : (
                <DetailPanel
                  person={selectedPerson}
                  relatedRecords={relatedRecords}
                  suspiciousScore={suspiciousScore}
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
