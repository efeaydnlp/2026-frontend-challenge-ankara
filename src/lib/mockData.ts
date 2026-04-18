import type { InvestigationSummary, Person, TimelineRecord } from "../types/investigation";

export const people: Person[] = [
  {
    id: "1",
    name: "Ayşe Kaya",
    note: "Last seen near Kızılay",
    riskLevel: "medium",
    lastSeen: "Kuğulu Park · 14:10",
  },
  {
    id: "2",
    name: "Mert Demir",
    note: "Mentioned in anonymous tip",
    riskLevel: "high",
    lastSeen: "Tunalı Hilmi · 14:42",
  },
  {
    id: "3",
    name: "Selin Aras",
    note: "Linked to two sightings",
    riskLevel: "medium",
    lastSeen: "Bestekar Street · 15:05",
  },
];

export const timelineRecords: TimelineRecord[] = [
  {
    id: "r1",
    type: "sighting",
    title: "Podo seen with Ayşe Kaya",
    description: "A witness reported seeing Podo being carried near the park entrance.",
    location: "Kuğulu Park",
    timestamp: "14:10",
    personIds: ["1"],
  },
  {
    id: "r2",
    type: "message",
    title: "Did you still have the cat with you?",
    description: "A short message referencing the missing pet was linked to Mert.",
    location: "Phone message",
    timestamp: "14:42",
    personIds: ["2"],
  },
  {
    id: "r3",
    type: "checkin",
    title: "Selin Aras checked in at Tunalı",
    description: "A nearby check-in placed Selin close to the last known route.",
    location: "Tunalı Hilmi",
    timestamp: "15:05",
    personIds: ["3"],
  },
  {
    id: "r4",
    type: "tip",
    title: "Anonymous tip mentioned Mert and a carrier box",
    description: "The tip claimed someone matching Mert's description had a small pet box.",
    location: "Unknown",
    timestamp: "15:20",
    personIds: ["2"],
  },
  {
    id: "r5",
    type: "note",
    title: "Ayşe was seen waiting near a taxi stop",
    description: "A handwritten note mentioned Ayşe acting stressed and checking her phone.",
    location: "Kızılay",
    timestamp: "15:40",
    personIds: ["1"],
  },
];

export const summary: InvestigationSummary = {
  mostSuspicious: "Mert Demir",
  lastSeenWith: "Ayşe Kaya",
};