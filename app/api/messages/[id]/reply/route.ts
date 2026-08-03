import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { replyText } = await request.json();

  if (!replyText) {
    return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
  }

  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  if (!resend) {
    return NextResponse.json({ error: "Email provider (Resend) is not configured" }, { status: 500 });
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact Form <onboarding@resend.dev>";
    
    // We send the reply TO the original sender
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: message.email,
      subject: `Re: ${message.subject || "Your message"}`,
      text: `${replyText}\n\n---\nOn ${new Date(message.createdAt).toLocaleString()}, ${message.name} wrote:\n${message.message}`,
    });

    if (error) {
      console.error("Resend API Error on Reply:", error);
      return NextResponse.json({ error: error.message || "Failed to send reply" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
