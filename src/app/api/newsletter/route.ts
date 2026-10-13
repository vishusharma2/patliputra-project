import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dispatchFormNotifications } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Attempt to persist in Supabase if newsletter_subscribers table exists
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
          email,
        });

        if (error) {
          console.warn("Notice: newsletter_subscribers insert note:", error.message);
        }
      } catch (dbErr) {
        console.warn("DB insert skipped for newsletter_subscribers:", dbErr);
      }
    }

    // Send notifications to Email (vishu.sharma90861@gmail.com) & WhatsApp (7303665845)
    const notificationResult = await dispatchFormNotifications({
      formTitle: "Newsletter Subscription",
      fields: {
        "Subscriber Email": email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully.",
      whatsappUrl: notificationResult.whatsappUrl,
    });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
