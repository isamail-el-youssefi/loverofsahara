import { CONTACT, whatsappBase } from "./data";

export interface RequestFields {
  name: string;
  email: string;
  /** Title of the chosen trip, or "" when the visitor has no trip in mind. */
  trip: string;
  dates: string;
  group: string;
  message: string;
}

export const EMPTY_REQUEST: RequestFields = { name: "", email: "", trip: "", dates: "", group: "", message: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Channel = "whatsapp" | "email";

/** Field -> error text. Empty object means the request can be sent on that channel. */
export function validate(f: RequestFields, channel: Channel): Partial<Record<keyof RequestFields, string>> {
  const errors: Partial<Record<keyof RequestFields, string>> = {};
  if (!f.name.trim()) errors.name = "Please tell us your name.";
  if (channel === "email" && !EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (!f.trip && !f.message.trim()) errors.message = "Choose a trip or write us a short message.";
  return errors;
}

/** The text that arrives in WhatsApp or the mail app. */
export function buildMessage(f: RequestFields): string {
  const lines = ["Hello Lover of Sahara, I would like to plan a trip.", ""];
  lines.push(`Name: ${f.name.trim()}`);
  if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
  lines.push(`Trip: ${f.trip || "Not decided yet / custom"}`);
  if (f.dates.trim()) lines.push(`Preferred dates: ${f.dates.trim()}`);
  if (f.group.trim()) lines.push(`Group size: ${f.group.trim()}`);
  if (f.message.trim()) lines.push("", f.message.trim());
  return lines.join("\n");
}

export const whatsappUrl = (f: RequestFields) => `${whatsappBase}?text=${encodeURIComponent(buildMessage(f))}`;

export const mailtoUrl = (f: RequestFields) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    f.trip ? `Trip request: ${f.trip}` : "Trip request from loverofsahara.com",
  )}&body=${encodeURIComponent(buildMessage(f))}`;
