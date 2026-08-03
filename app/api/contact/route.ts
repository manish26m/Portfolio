import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

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

    // 2. Clear Next.js cache so the admin inbox updates immediately
    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    // 3. Try to send email notification, but don't fail the request if it errors
    let emailStatus = "not_configured";
    let emailErrorDetails = null;

    if (resend) {
      try {
        const settings = await prisma.settings.findFirst();
        const adminEmail = settings?.email || process.env.ADMIN_EMAIL;
        
        // If the user has a verified domain, they should use it here instead of onboarding@resend.dev
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact Form <onboarding@resend.dev>";

        if (adminEmail) {
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            reply_to: email, // This allows you to just hit "Reply" in Gmail!
            subject: `New Contact Form Submission: ${subject || "No Subject"}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          });

          if (error) {
            console.error("Resend API Error:", error);
            emailStatus = "failed";
            emailErrorDetails = error;
          } else {
            console.log("Resend Email Sent Successfully:", data);
            emailStatus = "sent";
          }
        } else {
          emailStatus = "no_admin_email";
        }
      } catch (emailError) {
        console.error("Failed to send email notification via Resend:", emailError);
        emailStatus = "exception";
        emailErrorDetails = emailError;
      }
    }

    return NextResponse.json({ 
      success: true, 
      id: contact.id,
      emailStatus,
      emailErrorDetails
    });
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
