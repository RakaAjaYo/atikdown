import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { amount, donorName } = req.body;

  if (!amount || !donorName) {
    return res.status(400).json({ message: "Amount and donorName required" });
  }

  // Pakai slug toko
  const SLUG = "arthurxyz-studios"; // pastikan slug ini milik akunmu
  const API_KEY = process.env.PAKASIR_API_KEY; // pakai API Key milik akun yang sama

  try {
    const response = await fetch(`https://app.pakasir.com/api/v2/qr_payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        slug: SLUG,
        amount,
        description: `Donasi dari ${donorName}`
      })
    });

    const data = await response.json();

    if (!response.ok) return res.status(response.status).json(data);

    res.status(200).json(data); // data.qr_url akan dikirim ke frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
