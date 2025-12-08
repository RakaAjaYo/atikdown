// api/donate.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Wajib sesuai dokumen
    const apiKey = process.env.PAKASIR_API_KEY;   // simpan di Vercel env
    const project = process.env.PAKASIR_SLUG;     // slug proyek kamu
    const orderId = "DONATE_" + Date.now();       // ID unik

    const response = await fetch(
      "https://app.pakasir.com/api/transactioncreate/qris",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: project,
          order_id: orderId,
          amount: parseInt(amount),
          api_key: apiKey,
        }),
      }
    );

    const data = await response.json();

    // Jika gagal
    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to create transaction",
        detail: data,
      });
    }

    // sesuai dokumen → data.payment.payment_number (QR)
    return res.status(200).json({
      success: true,
      order_id: orderId,
      payment: data.payment,
      raw: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      detail: error.message,
    });
  }
}
