import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dispatchFormNotifications } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, position, experience, portfolioUrl, message } = body;

    if (!fullName || !phone || !email || !position) {
      return NextResponse.json(
        { error: "Full Name, Phone, Email, and Position are required." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("career_applications").insert({
        full_name: fullName,
        phone,
        email,
        position,
        experience: experience || null,
        portfolio_url: portfolioUrl || null,
        message: message || null,
      });

      if (error) {
        console.error("Error inserting career application into Supabase:", error);
      }
    }

    // Send notifications to Email (vishu.sharma90861@gmail.com) & WhatsApp (7303665845)
    const notificationResult = await dispatchFormNotifications({
      formTitle: "Career Application",
      fields: {
        "Applicant Name": fullName,
        "Phone Number": phone,
        "Email Address": email,
        "Position Applied": position,
        "Experience": experience || "Not specified",
        "Portfolio / Resume Link": portfolioUrl || "None",
        "Cover Note": message || "None",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Career application submitted.",
      whatsappUrl: notificationResult.whatsappUrl,
    });
  } catch (err) {
    console.error("Career API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
