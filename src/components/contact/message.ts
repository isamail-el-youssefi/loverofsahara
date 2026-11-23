import { CONTACT, whatsappBase } from "./data";
import type { PageStrings } from "@/i18n/pages";

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

export type FormStrings = PageStrings["contact"]["form"];

/** Field -> error text. Empty object means the request can be sent on that channel. */
export function validate(f: RequestFields, channel: Channel, t?: FormStrings): Partial<Record<keyof RequestFields, string>> {
  const errors: Partial<Record<keyof RequestFields, string>> = {};
  if (!f.name.trim()) errors.name = t?.errName ?? "Please tell us your name.";
  if (channel === "email" && !EMAIL_RE.test(f.email.trim())) errors.email = t?.errEmail ?? "Please enter a valid email address.";
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) errors.email = t?.errEmail ?? "Please enter a valid email address.";
  if (!f.trip && !f.message.trim()) errors.message = t?.errMessage ?? "Choose a trip or write us a short message.";
  return errors;
}

/** The text that arrives in WhatsApp or the mail app. */
export function buildMessage(f: RequestFields, t?: FormStrings): string {
  const hello = t?.hello ?? "Hello Lover of Sahara, I would like to plan a trip.";
  const lName = t?.lName ?? "Name";
  const lEmail = t?.lEmail ?? "Email";
  const lTrip = t?.lTrip ?? "Trip";
  const lDates = t?.lDates ?? "Preferred dates";
  const lGroup = t?.lGroup ?? "Group size";
  const notDecided = t?.notDecided ?? "Not decided yet / custom";

  const lines = [hello, ""];
  lines.push(`${lName}: ${f.name.trim()}`);
  if (f.email.trim()) lines.push(`${lEmail}: ${f.email.trim()}`);
  lines.push(`${lTrip}: ${f.trip || notDecided}`);
  if (f.dates.trim()) lines.push(`${lDates}: ${f.dates.trim()}`);
  if (f.group.trim()) lines.push(`${lGroup}: ${f.group.trim()}`);
  if (f.message.trim()) lines.push("", f.message.trim());
  return lines.join("\n");
}

export const whatsappUrl = (f: RequestFields, t?: FormStrings) => `${whatsappBase}?text=${encodeURIComponent(buildMessage(f, t))}`;

export const mailtoUrl = (f: RequestFields, t?: FormStrings) => {
  const subject = f.trip
    ? (t ? t.subjectTrip.replace("{trip}", f.trip) : `Trip request: ${f.trip}`)
    : (t ? t.subjectNone : "Trip request from loverofsahara.tours");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildTripInquiryMessage_legacy(f, t))}`;
};

const buildTripInquiryMessage_legacy = buildMessage;

function subjectFor(f: RequestFields, t?: FormStrings) {
  return f.trip
    ? (t ? t.subjectTrip.replace("{trip}", f.trip) : `Trip request: ${f.trip}`)
    : (t ? t.subjectNone : "Trip request from loverofsahara.tours");
}

/** Same message, composed in a Gmail browser tab. */
export const gmailUrl = (f: RequestFields, t?: FormStrings) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent(subjectFor(f, t))}&body=${encodeURIComponent(buildMessage(f, t))}`;

export interface TripInquiryParams {
  tripTitle: string;
  durationDays: number;
  departureCity?: string | undefined;
  persons: number | "solo" | "custom";
  pricePerPersonPerDay?: number | undefined;
  totalPerPerson?: number | undefined;
  groupTotal?: number | undefined;
}

/** Pre-filled message for trip detail page inquiries with selected tier or custom group */
export function buildTripInquiryMessage(p: TripInquiryParams): string {
  const isSolo = p.persons === 1 || p.persons === "solo";
  const isCustom = p.persons === "custom";

  const lines = [
    "Hello Lover of Sahara! 🐪",
    "",
    `I would like to inquire about booking: ${p.tripTitle}`,
  ];

  if (isSolo) {
    lines.push("• Group size: Solo traveler (1 person)");
  } else if (isCustom) {
    lines.push("• Group size: Large group (6+ people / custom quote)");
  } else {
    lines.push(`• Group size: ${p.persons} ${p.persons === 1 ? "person" : "people"}`);
  }

  lines.push(`• Duration: ${p.durationDays} ${p.durationDays === 1 ? "day" : "days"}`);
  if (p.departureCity) {
    lines.push(`• Departure: ${p.departureCity.charAt(0).toUpperCase() + p.departureCity.slice(1)}`);
  }

  if (p.totalPerPerson && !isCustom && !isSolo) {
    lines.push(`• Quoted rate: €${p.totalPerPerson} per person (€${p.pricePerPersonPerDay}/day)`);
    if (p.groupTotal) {
      lines.push(`• Estimated total: €${p.groupTotal} (private group)`);
    }
  } else if (isSolo) {
    lines.push("• Note: Requesting private solo traveler rate & options");
  } else if (isCustom) {
    lines.push("• Note: Requesting custom group discount & private vehicle");
  }

  lines.push("");
  lines.push("Could you please share availability and more details?");
  return lines.join("\n");
}

export function buildTripWhatsappUrl(p: TripInquiryParams): string {
  return `${whatsappBase}?text=${encodeURIComponent(buildTripInquiryMessage(p))}`;
}

export function buildTripMailtoUrl(p: TripInquiryParams): string {
  const groupLabel =
    p.persons === "solo" || p.persons === 1
      ? "Solo traveler"
      : p.persons === "custom"
        ? "Custom group (6+)"
        : `${p.persons} travelers`;
  const subject = `Trip Inquiry: ${p.tripTitle} (${groupLabel})`;
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildTripInquiryMessage(p))}`;
}

export function buildTripGmailUrl(p: TripInquiryParams): string {
  const groupLabel =
    p.persons === "solo" || p.persons === 1
      ? "Solo traveler"
      : p.persons === "custom"
        ? "Custom group (6+)"
        : `${p.persons} travelers`;
  const subject = `Trip Inquiry: ${p.tripTitle} (${groupLabel})`;
  const body = buildTripInquiryMessage(p);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


