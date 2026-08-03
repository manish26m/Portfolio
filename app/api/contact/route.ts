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

    // 1. ALWAYS save to the database first (Admin Inbox)
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // 2. Try to send email notification, but don't fail the request if it errors
    if (resend) {
      try {
        const settings = await prisma.settings.findFirst();
        const adminEmail = settings?.email || process.env.ADMIN_EMAIL;

        if (adminEmail) {
          await resend.emails.send({
            from: "Portfolio Contact Form <onboarding@resend.dev>", // Resend free tier requires this 'from' address
            to: adminEmail,
            subject: `New Contact Form Submission: ${subject || "No Subject"}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          });
        }
      } catch (emailError) {
        console.error("Failed to send email notification via Resend:", emailError);
        // We log the error but do NOT throw it, so the user still sees a success message
      }
    }

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
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
