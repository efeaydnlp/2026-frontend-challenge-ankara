import { people, summary, timelineRecords } from "./mockData";
import type {
  InvestigationSummary,
  Person,
  TimelineRecord,
} from "../types/investigation";

type InvestigationData = {
  people: Person[];
  records: TimelineRecord[];
  summary: InvestigationSummary;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchInvestigationData(): Promise<InvestigationData> {
  await wait(500);

  return {
    people,
    records: timelineRecords,
    summary,
  };
}