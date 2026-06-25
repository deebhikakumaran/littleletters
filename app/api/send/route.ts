import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { toEmail, fromName, link } = await req.json();

    if (!toEmail || !link) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    
    const { data, error } = await resend.emails.send({
      from: "little letters <no-reply@ratify.live>",
      to: toEmail,
      subject: `a little letter${fromName ? " from " + fromName : ""}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #2e2a26;">
          <p>someone wrote you a little letter.</p>
          <p><a href="${link}" style="color: #c8889a;">open your letter →</a></p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}