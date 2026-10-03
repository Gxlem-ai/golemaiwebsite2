import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Demo request endpoint.
 *
 * Validates the submission and delivers it through every channel configured:
 *
 *  - Email: when SMTP_PASS is set, the request is emailed to CONTACT_EMAIL
 *    through the mailbox's SMTP server (Purelymail by default). Variables:
 *    SMTP_USER (defaults to CONTACT_EMAIL), SMTP_PASS, SMTP_HOST (defaults to
 *    smtp.purelymail.com) and SMTP_PORT (defaults to 465, implicit TLS).
 *  - Webhook: when DEMO_REQUEST_WEBHOOK_URL is set, the record is also
 *    forwarded there as JSON (CRM intake, Zapier/Make hook, Slack, ...).
 *
 * The request succeeds when at least one channel delivers. When none is
 * configured it is logged and the response carries `delivered: false`, which
 * tells the form to hand the visitor a prefilled email to CONTACT_EMAIL, so no
 * enquiry is lost.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, company: 160, pos: 120 } as const;

const FAILURE_MESSAGE = `The request could not be submitted at this time. Please try again shortly or email ${CONTACT_EMAIL}.`;

type Field = keyof typeof LIMITS;

function readField(body: Record<string, unknown>, key: Field): string {
  const raw = body[key];
  return typeof raw === "string" ? raw.trim() : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const name = readField(body, "name");
  const email = readField(body, "email");
  const company = readField(body, "company");
  const pos = readField(body, "pos");

  if (!name || !email || !company) {
    return NextResponse.json({ error: "Name, work email and company are required." }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid work email address." }, { status: 400 });
  }
  for (const [key, max] of Object.entries(LIMITS) as [Field, number][]) {
    if (readField(body, key).length > max) {
      return NextResponse.json({ error: `The ${key} field is too long.` }, { status: 400 });
    }
  }

  const record = {
    source: "golem-ai-website",
    submittedAt: new Date().toISOString(),
    name,
    email,
    company,
    pos: pos || null,
  };

  const webhook = process.env.DEMO_REQUEST_WEBHOOK_URL;
  const smtpConfigured = Boolean(process.env.SMTP_PASS);

  if (!webhook && !smtpConfigured) {
    console.warn("[demo] Neither SMTP_PASS nor DEMO_REQUEST_WEBHOOK_URL is set. Request logged only:", JSON.stringify(record));
    return NextResponse.json({ ok: true, delivered: false });
  }

  const attempts: Promise<void>[] = [];
  if (smtpConfigured) attempts.push(sendEmail(record));
  if (webhook) attempts.push(forwardToWebhook(webhook, record));

  const results = await Promise.allSettled(attempts);
  for (const r of results) {
    if (r.status === "rejected") console.error("[demo] Delivery channel failed:", r.reason);
  }
  if (!results.some((r) => r.status === "fulfilled")) {
    console.error("[demo] No channel delivered. Request:", JSON.stringify(record));
    return NextResponse.json({ error: FAILURE_MESSAGE }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}

type DemoRecord = {
  source: string;
  submittedAt: string;
  name: string;
  email: string;
  company: string;
  pos: string | null;
};

async function forwardToWebhook(url: string, record: DemoRecord) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded with status ${res.status}`);
}

/** Collapses anything that could break out of a header line. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

async function sendEmail(record: DemoRecord) {
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER ?? CONTACT_EMAIL;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.purelymail.com",
    port,
    secure: port === 465,
    auth: { user, pass: process.env.SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: { name: "GOLEM AI website", address: CONTACT_EMAIL },
    to: CONTACT_EMAIL,
    replyTo: { name: oneLine(record.name), address: record.email },
    subject: `Demo request: ${oneLine(record.company)} (${oneLine(record.name)})`,
    text: [
      "New demo request from the GOLEM AI website.",
      "",
      `Name: ${oneLine(record.name)}`,
      `Email: ${record.email}`,
      `Company: ${oneLine(record.company)}`,
      `Point of sale: ${record.pos ? oneLine(record.pos) : "not given"}`,
      `Submitted: ${record.submittedAt}`,
      "",
      "Reply to this email to answer the visitor directly.",
    ].join("\n"),
  });
}
