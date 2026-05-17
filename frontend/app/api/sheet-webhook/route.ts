import { NextRequest, NextResponse } from 'next/server';

const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL || '';

export async function POST(req: NextRequest) {
  if (!SHEET_URL) {
    return NextResponse.json({ ok: false, error: 'SHEET_URL not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();

    const resp = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    return NextResponse.json({ ok: true, upstream: text });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
