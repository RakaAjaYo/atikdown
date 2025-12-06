export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount || amount < 2000) {
      return res.status(400).json({ success: false, message: "Minimal donasi 2000" });
    }

    const SLUG = "arthurxyz-studios";
    const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";

    // Pakasir API REQUIRES apikey INSIDE BODY, not header
    const response = await fetch("https://app.pakasir.com/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: API_KEY,
        slug: SLUG,
        amount: amount,
        note: "Donasi untuk ATikdown"
      })
    });

    const result = await response.json();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || "Gagal membuat pembayaran"
      });
    }

    return res.status(200).json({
      success: true,
      payment_url: result.payment_url
    });

  } catch (err) {
    console.error("Donate API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
