import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, unitType, budget, note } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from("quote_inquiries").insert({
        name,
        phone,
        email: email || null,
        unit_type: unitType || null,
        budget: budget || null,
        note: note || null,
      });

      if (error) {
        console.error("Error inserting quote into Supabase:", error);
      }
    }

    return NextResponse.json({ success: true, message: "Quote inquiry saved." });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
