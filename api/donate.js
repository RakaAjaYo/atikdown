import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount wajib diisi" });
    }

    const paymentData = {
      apikey: "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM",
      slug: "arthurxyz-studios",
      amount: Number(amount),
      customer_name: "Anonymous",
      description: "Donasi ATikdown",
    };

    const reqPakasir = await fetch("https://app.pakasir.com/api/create-qris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const result = await reqPakasir.json();

    if (!result.success) {
      return res.status(500).json({ error: "Gagal membuat QRIS" });
    }

    return res.status(200).json({
      success: true,
      payment_url: result.payment_url
    });

  } catch (err) {
    console.error("Donate API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
