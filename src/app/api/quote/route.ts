import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dispatchFormNotifications } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userType,
      name,
      phone,
      unitType,
      budget,
      note,
      agencyName,
      currentAgency,
      email,
      experience,
      reraNumber,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const isBroker = userType === "broker";
    const resolvedAgency = currentAgency || agencyName || "Independent";

    if (isSupabaseConfigured && supabaseAdmin) {
      const dbName = isBroker
        ? `${name}${resolvedAgency ? ` (${resolvedAgency} - Broker)` : " (Broker)"}`
        : name;

      const brokerMeta = isBroker
        ? [
            resolvedAgency ? `Current Agency: ${resolvedAgency}` : null,
            experience ? `Experience: ${experience}` : null,
            reraNumber ? `RERA: ${reraNumber}` : null,
            email ? `Email: ${email}` : null,
          ]
            .filter(Boolean)
            .join(" | ")
        : null;

      const combinedNote = brokerMeta
        ? `[${brokerMeta}] ${note || ""}`.trim()
        : note || null;

      const { error } = await supabaseAdmin.from("quote_inquiries").insert({
        name: dbName,
        phone,
        unit_type: isBroker
          ? (experience ? `Exp: ${experience}` : "Broker Registration")
          : (unitType || null),
        budget: isBroker ? (resolvedAgency || null) : (budget || null),
        note: combinedNote,
      });

      if (error) {
        console.error("Error inserting quote into Supabase:", error);
      }
    }

    // Send notifications to Email (vishu.sharma90861@gmail.com) & WhatsApp (7303665845)
    const notificationResult = await dispatchFormNotifications({
      formTitle: isBroker
        ? "New Broker Registration - Channel Partner Network"
        : "Customer Quote Request",
      fields: isBroker
        ? {
            "Form Type": "Register as a Broker",
            "Broker Name": name,
            "Current Agency": resolvedAgency,
            "Mobile Number": phone,
            "Email Address": email || "Not provided",
            "Experience": experience || "Not specified",
            "RERA Registration No": reraNumber || "Not registered / Individual",
            "Notes / Specialization": note || "None",
          }
        : {
            "Inquiry Type": "Direct Customer",
            "Customer Name": name,
            "Phone Number": phone,
            "Unit Configuration": unitType || "Not specified",
            "Expected Budget": budget || "Not specified",
            "Additional Note": note || "None",
          },
    });

    return NextResponse.json({
      success: true,
      message: isBroker ? "Broker registration saved." : "Quote inquiry saved.",
      whatsappUrl: notificationResult.whatsappUrl,
    });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
