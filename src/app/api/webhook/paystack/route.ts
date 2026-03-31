import { NextResponse } from "next/server"; // Fixed import
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Get the raw body as text for signature verification
    const rawBody = await req.text();
    const paystackSignature = req.headers.get("x-paystack-signature");

    if (!paystackSignature) {
      return new NextResponse("No signature provided", { status: 401 });
    }

    // 2. Verify the Signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== paystackSignature) {
      console.error("❌ Invalid Paystack Signature");
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    // 3. Parse the body now that it's verified
    const body = JSON.parse(rawBody);
    const event = body.event;

    console.log("✅ Webhook Received:", event);

    // 4. Handle successful payment
    if (event === "charge.success") {
      const { amount, customer, reference, metadata } = body.data;

      // Use the user_id we passed in the metadata during checkout
      const userId = metadata?.user_id;

      if (userId) {
        const { error: txError } = await supabase.from("transactions").insert([
          {
            user_id: userId,
            amount: amount / 100, // Convert Kobo to Naira
            type: "credit",
            status: "success",
            description: `Paystack Deposit: ${customer.email}`,
            reference: reference,
            category: "Settlement",
          },
        ]);

        if (txError) {
          console.error("❌ Database Insert Error:", txError);
          return new NextResponse("DB Error", { status: 500 });
        }
      }
    }

    return new NextResponse("Webhook Processed", { status: 200 });
  } catch (error: any) {
    console.error("⚠️ Webhook Handler Crash:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}