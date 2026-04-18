import { normalizeMessages } from "./normalize";

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