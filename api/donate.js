import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { amount, donorName } = req.body;

  if (!amount || !donorName) {
    return res.status(400).json({ message: "Amount and donorName required" });
  }

  try {
    const response = await fetch("https://app.pakasir.com/api/v2/qr_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM" // API Key
      },
      body: JSON.stringify({
        slug: "arthurxyz-studios",
        amount,
        description: `Donasi dari ${donorName}`
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.status(200).json(data); // Mengirimkan info QRIS atau URL pembayaran
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
