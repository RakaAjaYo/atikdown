export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Method not allowed" });

  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount required" });
  }

  const SLUG = "arthurxyz-studios";
  const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";

  try {
    const pay = await fetch("https://app.pakasir.com/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": API_KEY
      },
      body: JSON.stringify({
        slug: SLUG,
        amount: amount,
        note: "Donasi untuk ATikdown"
      })
    });

    const data = await pay.json();

    if (!data.success) {
      return res.status(500).json({ success: false, message: "Gagal membuat pembayaran" });
    }

    return res.json({
      success: true,
      payment_url: data.payment_url
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
      }
