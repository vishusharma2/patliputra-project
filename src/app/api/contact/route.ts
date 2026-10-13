import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dispatchFormNotifications } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, propertyType, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    // Attempt to persist in Supabase if contact_inquiries table exists
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.from("contact_inquiries").insert({
          name,
          email: email || null,
          phone,
          property_type: propertyType || null,
          message: message || null,
        });

        if (error) {
          console.warn("Notice: contact_inquiries insert note:", error.message);
        }
      } catch (dbErr) {
        console.warn("DB insert skipped for contact_inquiries:", dbErr);
      }
    }

    // Send notifications to Email (vishu.sharma90861@gmail.com) & WhatsApp (7303665845)
    const notificationResult = await dispatchFormNotifications({
      formTitle: "Contact & Site Visit Enquiry",
      fields: {
        "Visitor Name": name,
        "Phone Number": phone,
        "Email Address": email || "Not provided",
        "Preferred Property": propertyType || "General Inquiry",
        "Message": message || "None",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully.",
      whatsappUrl: notificationResult.whatsappUrl,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
