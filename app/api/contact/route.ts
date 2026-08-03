import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Send email notification if Resend is configured
    if (resend) {
      const settings = await prisma.settings.findFirst();
      const adminEmail = settings?.email || process.env.ADMIN_EMAIL;

      if (adminEmail) {
        await resend.emails.send({
          from: "Portfolio Contact Form <onboarding@resend.dev>", // Note: Use your verified domain in production
          to: adminEmail,
          subject: `New Contact Form Submission: ${subject || "No Subject"}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });
      } else {
        console.warn("Resend is configured but no admin email is set in settings or env.");
      }
    }

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  // Admin only — get all messages
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(messages);
}
