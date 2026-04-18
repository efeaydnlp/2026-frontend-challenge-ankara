import type { UnifiedRecord } from "../types/investigation";

type JotformAnswer = {
  name?: string;
  text?: string;
  type?: string;
  answer?: unknown;
};

type JotformSubmission = {
  id: string;
  created_at?: string;
  answers?: Record<string, JotformAnswer>;
};

function getAnswerValue(
  answers: Record<string, JotformAnswer> | undefined,
  fieldName: string
): string {
  if (!answers) return "";

  const entry = Object.values(answers).find(
    (answer) => answer.name === fieldName
  );

  const value = entry?.answer;

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
}

export function normalizeMessages(
  submissions: JotformSubmission[]
): UnifiedRecord[] {
  return submissions.map((submission) => {
    const senderName = getAnswerValue(submission.answers, "senderName");
    const recipientName = getAnswerValue(submission.answers, "recipientName");
    const timestamp =
      getAnswerValue(submission.answers, "timestamp") || submission.created_at || "";
    const location = getAnswerValue(submission.answers, "location");
    const coordinates = getAnswerValue(submission.answers, "coordinates");
    const text = getAnswerValue(submission.answers, "text");
    const urgency = getAnswerValue(submission.answers, "urgency");

    return {
      id: submission.id,
      type: "message",
      title: `${senderName} → ${recipientName}`,
      content: text,
      timestamp,
      location,
      coordinates,
      personNames: [senderName, recipientName].filter(Boolean),
      urgency,
      raw: submission,
    };
  });
}

export function normalizeCheckins(
  submissions: JotformSubmission[]
): UnifiedRecord[] {
  return submissions.map((submission) => {
    const personName = getAnswerValue(submission.answers, "personName");
    const timestamp =
      getAnswerValue(submission.answers, "timestamp") || submission.created_at || "";
    const location = getAnswerValue(submission.answers, "location");
    const coordinates = getAnswerValue(submission.answers, "coordinates");
    const note = getAnswerValue(submission.answers, "note");

    return {
      id: submission.id,
      type: "checkin",
      title: `${personName} checked in`,
      content: note,
      timestamp,
      location,
      coordinates,
      personNames: [personName].filter(Boolean),
      raw: submission,
    };
  });
}

export function normalizeSightings(
  submissions: JotformSubmission[]
): UnifiedRecord[] {
  return submissions.map((submission) => {
    const personName = getAnswerValue(submission.answers, "personName");
    const seenWith = getAnswerValue(submission.answers, "seenWith");
    const timestamp =
      getAnswerValue(submission.answers, "timestamp") || submission.created_at || "";
    const location = getAnswerValue(submission.answers, "location");
    const coordinates = getAnswerValue(submission.answers, "coordinates");
    const note = getAnswerValue(submission.answers, "note");

    return {
      id: submission.id,
      type: "sighting",
      title: seenWith
        ? `${personName} seen with ${seenWith}`
        : `${personName} sighting`,
      content: note,
      timestamp,
      location,
      coordinates,
      personNames: [personName, seenWith].filter(Boolean),
      raw: submission,
    };
  });
}

function splitPeople(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeNotes(
  submissions: JotformSubmission[]
): UnifiedRecord[] {
  return submissions.map((submission) => {
    const authorName = getAnswerValue(submission.answers, "authorName");
    const timestamp =
      getAnswerValue(submission.answers, "timestamp") || submission.created_at || "";
    const location = getAnswerValue(submission.answers, "location");
    const coordinates = getAnswerValue(submission.answers, "coordinates");
    const note = getAnswerValue(submission.answers, "note");
    const mentionedPeople = getAnswerValue(submission.answers, "mentionedPeople");

    return {
      id: submission.id,
      type: "note",
      title: `${authorName} note`,
      content: note,
      timestamp,
      location,
      coordinates,
      personNames: [authorName, ...splitPeople(mentionedPeople)].filter(Boolean),
      raw: submission,
    };
  });
}

export function normalizeTips(
  submissions: JotformSubmission[]
): UnifiedRecord[] {
  return submissions.map((submission) => {
    const timestamp =
      getAnswerValue(submission.answers, "timestamp") || submission.created_at || "";
    const location = getAnswerValue(submission.answers, "location");
    const coordinates = getAnswerValue(submission.answers, "coordinates");
    const suspectName = getAnswerValue(submission.answers, "suspectName");
    const tip = getAnswerValue(submission.answers, "tip");
    const confidence = getAnswerValue(submission.answers, "confidence");

    return {
      id: submission.id,
      type: "tip",
      title: suspectName ? `Tip about ${suspectName}` : "Anonymous tip",
      content: tip,
      timestamp,
      location,
      coordinates,
      personNames: [suspectName].filter(Boolean),
      urgency: confidence,
      raw: submission,
    };
  });
}



export function extractPeople(records: UnifiedRecord[]) {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      note: string;
      riskLevel: "low" | "medium" | "high";
      lastSeen?: string;
    }
  >();

  for (const record of records) {
    for (const personName of record.personNames) {
      if (!personName) continue;
      if (personName.toLowerCase() === "unknown") continue;

      const existing = map.get(personName);

      const riskLevel =
        record.type === "tip"
          ? "high"
          : record.type === "sighting"
          ? "medium"
          : "low";

      const note =
        record.type === "message"
          ? "Mentioned in messages"
          : record.type === "checkin"
          ? "Has check-in activity"
          : record.type === "sighting"
          ? "Linked to sightings"
          : record.type === "note"
          ? "Mentioned in personal notes"
          : "Mentioned in anonymous tips";

      const lastSeen = record.location
        ? `${record.location} · ${record.timestamp ?? ""}`
        : record.timestamp ?? "";

      if (!existing) {
        map.set(personName, {
          id: personName,
          name: personName,
          note,
          riskLevel,
          lastSeen,
        });
        continue;
      }

      const riskRank = { low: 1, medium: 2, high: 3 };
      const mergedRisk =
        riskRank[riskLevel] > riskRank[existing.riskLevel]
          ? riskLevel
          : existing.riskLevel;

      map.set(personName, {
        ...existing,
        riskLevel: mergedRisk,
        lastSeen: existing.lastSeen || lastSeen,
      });
    }
  }

  return Array.from(map.values());
}

export function getRelatedRecords(records: UnifiedRecord[], personName: string) {
  return sortRecordsByTimestamp(
    records.filter((record) => record.personNames.includes(personName))
  );
}

export function calculateSuspiciousScore(records: UnifiedRecord[], personName: string) {
  const related = getRelatedRecords(records, personName);

  let score = 0;

  for (const record of related) {
    if (record.type === "tip") score += 4;
    if (record.type === "sighting") score += 3;
    if (record.type === "checkin") score += 2;
    if (record.type === "note") score += 1;
    if (record.type === "message") score += 1;

    if (record.urgency === "high") score += 2;
    if (record.urgency === "medium") score += 1;
  }

  return score;
}

function parseTurkishDateTime(value?: string): number {
  if (!value) return 0;

  const match = value.match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/
  );

  if (!match) return 0;

  const [, day, month, year, hour, minute] = match;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ).getTime();
}

export function sortRecordsByTimestamp(records: UnifiedRecord[]): UnifiedRecord[] {
  return [...records].sort((a, b) => {
    return parseTurkishDateTime(a.timestamp) - parseTurkishDateTime(b.timestamp);
  });
}

