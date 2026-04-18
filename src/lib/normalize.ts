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