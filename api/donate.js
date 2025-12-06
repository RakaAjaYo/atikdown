export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount || amount < 2000) {
      return res.status(400).json({ error: "Jumlah minimal 2000" });
    }

    const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";
    const SLUG = "arthurxyz-studios";

    const payload = {
      slug: SLUG,
      amount: Number(amount),
      payment_method: "qris",        // penting, WAJIB ADA
      description: "Donasi ATikdown",
      customer_name: "ATikdown User"
    };

    const response = await fetch("https://api.pakasir.com/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Pakasir response:", result);

    if (!response.ok || !result?.data?.url) {
      return res.status(500).json({
        error: result?.message || "Gagal membuat pembayaran"
      });
    }

    return res.status(200).json({
      success: true,
      payment_url: result.data.url,
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
