import { NextResponse } from "next/server";

/**
 * Demo request endpoint.
 *
 * Validates the submission and forwards it as JSON to the URL configured in
 * DEMO_REQUEST_WEBHOOK_URL (a CRM intake endpoint, Zapier/Make hook, Slack
 * incoming webhook, or similar). When the variable is not set the request is
 * accepted and written to the server log so that no enquiry is lost while
 * the integration is being configured.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, company: 160, pos: 120 } as const;

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
  if (!webhook) {
    console.warn("[demo] DEMO_REQUEST_WEBHOOK_URL is not set. Request logged only:", JSON.stringify(record));
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Webhook responded with status ${res.status}`);
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[demo] Failed to forward demo request:", err);
    return NextResponse.json(
      { error: "The request could not be submitted at this time. Please try again shortly." },
      { status: 502 }
    );
  }
}
