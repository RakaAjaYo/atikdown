export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Vercel auto-parse JSON
    const { amount } = req.body;

    if (!amount || Number(amount) < 2000) {
      return res.status(400).json({
        success: false,
        message: "Minimal donasi adalah 2000"
      });
    }

    const merchant = "arthurxyz-studios";
    const apikey = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";

    // Request ke Pakasir
    const apiRes = await fetch("https://api.pakasir.com/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: merchant,
        apikey: apikey,
        amount: amount,
        description: "Donasi ATikdown"
      })
    });

    const data = await apiRes.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: data.message || "Gagal membuat pembayaran"
      });
    }

    return res.status(200).json({
      success: true,
      payment_url: data.payment_url
    });

  } catch (error) {
    console.error("DONATE API ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
