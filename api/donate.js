import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ success: false, error: "Name & amount required" });
    }

    // --- Request ke Pakasir ---
    const apiRes = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apikey: process.env.PAKASIR_KEY,  // <- API KEY kamu
        amount: amount,
        note: `Donasi dari ${name}`
      })
    });

    // --- Ambil raw text dulu (agar bisa debug klo bukan JSON) ---
    const raw = await apiRes.text();
    console.log("RAW RESPONSE PAKASIR:", raw);

    let data;
    try {
      data = JSON.parse(raw); // kalau ini gagal → berarti HTML
    } catch {
      return res.status(500).json({
        success: false,
        error: "Pakasir mengirim HTML, kemungkinan API-key salah."
      });
    }

    // --- Validasi API response ---
    if (!data || !data.data || !data.data.qr_url) {
      return res.status(500).json({
        success: false,
        error: data?.message || "Pakasir error"
      });
    }

    // --- Return ke FE ---
    return res.status(200).json({
      success: true,
      qr_url: data.data.qr_url,     // URL QRIS
      qr_image: data.data.qr_image, // base64 image
      ref_id: data.data.ref_id
    });

  } catch (err) {
    console.error("DONATE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Fetch failed (server error)"
    });
  }
}
