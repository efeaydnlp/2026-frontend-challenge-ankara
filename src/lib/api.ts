import {
  normalizeCheckins,
  normalizeMessages,
  normalizeNotes,
  normalizeSightings,
} from "./normalize";

const API_KEY = import.meta.env.VITE_JOTFORM_API_KEY;
const BASE_URL = import.meta.env.VITE_JOTFORM_BASE_URL || "https://api.jotform.com";

const FORM_IDS = {
  checkins: "261065067494966",
  messages: "261065765723966",
  sightings: "261065244786967",
  notes: "261065509008958",
  tips: "261065875889981",
};

type JotformAnswer = {
  name?: string;
  text?: string;
  type?: string;
  answer?: unknown;
};

type JotformSubmission = {
  id: string;
  form_id: string;
  created_at?: string;
  updated_at?: string | null;
  answers?: Record<string, JotformAnswer>;
};

function ensureEnv() {
  if (!API_KEY) {
    throw new Error("Missing VITE_JOTFORM_API_KEY in .env.local");
  }
}

async function getFormSubmissions(formId: string): Promise<JotformSubmission[]> {
  ensureEnv();

  const url = `${BASE_URL}/form/${formId}/submissions?apiKey=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Jotform request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.content ?? [];
}

export async function fetchMessagesOnly() {
  const messages = await getFormSubmissions(FORM_IDS.messages);
  const normalized = normalizeMessages(messages);

  console.log("MESSAGES NORMALIZED:", normalized);
  return normalized;
}

export async function fetchCheckinsOnly() {
  const checkins = await getFormSubmissions(FORM_IDS.checkins);

  console.log("CHECKINS RAW:", checkins);

  if (checkins.length > 0) {
    const first = checkins[0] as { answers?: Record<string, JotformAnswer> };

    console.log("FIRST CHECKIN OBJECT:", first);
    console.log("FIRST CHECKIN ANSWERS:", first.answers);

    const flattenedAnswers = Object.entries(first.answers ?? {}).map(
      ([questionId, answer]) => ({
        questionId,
        name: answer.name,
        text: answer.text,
        type: answer.type,
        answer: answer.answer,
      })
    );

    console.log("FIRST CHECKIN ANSWERS FLATTENED:", flattenedAnswers);
  }

  return checkins;
}

export async function fetchMessagesAndCheckins() {
  const [messages, checkins] = await Promise.all([
    getFormSubmissions(FORM_IDS.messages),
    getFormSubmissions(FORM_IDS.checkins),
  ]);

  const normalizedMessages = normalizeMessages(messages);
  const normalizedCheckins = normalizeCheckins(checkins);

  const combined = [...normalizedMessages, ...normalizedCheckins];

  console.log("COMBINED RECORDS:", combined);

  return combined;
}

export async function fetchSightingsOnly() {
  const sightings = await getFormSubmissions(FORM_IDS.sightings);

  console.log("SIGHTINGS RAW:", sightings);

  if (sightings.length > 0) {
    const first = sightings[0] as { answers?: Record<string, JotformAnswer> };

    console.log("FIRST SIGHTING OBJECT:", first);
    console.log("FIRST SIGHTING ANSWERS:", first.answers);

    const flattenedAnswers = Object.entries(first.answers ?? {}).map(
      ([questionId, answer]) => ({
        questionId,
        name: answer.name,
        text: answer.text,
        type: answer.type,
        answer: answer.answer,
      })
    );

    console.log("FIRST SIGHTING ANSWERS FLATTENED:", flattenedAnswers);
  }

  return sightings;
}

export async function fetchMessagesCheckinsAndSightings() {
  const [messages, checkins, sightings] = await Promise.all([
    getFormSubmissions(FORM_IDS.messages),
    getFormSubmissions(FORM_IDS.checkins),
    getFormSubmissions(FORM_IDS.sightings),
  ]);

  const normalizedMessages = normalizeMessages(messages);
  const normalizedCheckins = normalizeCheckins(checkins);
  const normalizedSightings = normalizeSightings(sightings);

  const combined = [
    ...normalizedMessages,
    ...normalizedCheckins,
    ...normalizedSightings,
  ];

  console.log("COMBINED 3 SOURCES:", combined);

  return combined;
}

export async function fetchNotesOnly() {
  const notes = await getFormSubmissions(FORM_IDS.notes);

  console.log("NOTES RAW:", notes);

  if (notes.length > 0) {
    const first = notes[0] as { answers?: Record<string, JotformAnswer> };

    console.log("FIRST NOTE OBJECT:", first);
    console.log("FIRST NOTE ANSWERS:", first.answers);

    const flattenedAnswers = Object.entries(first.answers ?? {}).map(
      ([questionId, answer]) => ({
        questionId,
        name: answer.name,
        text: answer.text,
        type: answer.type,
        answer: answer.answer,
      })
    );

    console.log("FIRST NOTE ANSWERS FLATTENED:", flattenedAnswers);
  }

  return notes;
}

export async function fetchFourSources() {
  const [messages, checkins, sightings, notes] = await Promise.all([
    getFormSubmissions(FORM_IDS.messages),
    getFormSubmissions(FORM_IDS.checkins),
    getFormSubmissions(FORM_IDS.sightings),
    getFormSubmissions(FORM_IDS.notes),
  ]);

  const combined = [
    ...normalizeMessages(messages),
    ...normalizeCheckins(checkins),
    ...normalizeSightings(sightings),
    ...normalizeNotes(notes),
  ];

  console.log("COMBINED 4 SOURCES:", combined);

  return combined;
}