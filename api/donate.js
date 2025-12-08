import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, amount } = req.body;

    const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";
    const SLUG = "arthurxyz-studios";

    const payload = {
      slug: SLUG,
      amount: Number(amount),
      customer_name: name,
      payment_method: "qris",     // ⬅ WAJIB BIAR QRIS MUNCUL
      description: `Donasi dari ${name}`,
      expired_time: 10            // boleh ada, boleh tidak
    };

    const response = await fetch("https://app.pakasir.com/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("RAW RESULT:", result);

    // Jika Pakasir gagal membuat QRIS
    if (!result.data || !result.data.checkout_url) {
      return res.status(400).json({
        success: false,
        error: result.message || "Gagal membuat QRIS"
      });
    }

    return res.status(200).json({
      success: true,
      payment_url: result.data.checkout_url
    });

  } catch (err) {
    console.error("DONATE ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
