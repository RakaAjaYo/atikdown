export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let body = req.body;

    // Antisipasi vercel bug: req.body kadang undefined di serverless
    if (!body || typeof body !== "object") {
      const raw = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
      });

      try {
        body = JSON.parse(raw);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON Body" });
      }
    }

    const { amount, name } = body;

    if (!amount) {
  return res.status(400).json({ error: "Amount wajib diisi" });
}

const donorName = name ? name : "Anonymous";

    const API_KEY = process.env.PAKASIR_API_KEY;
    const SLUG = process.env.PAKASIR_SLUG;

    if (!API_KEY || !SLUG) {
      return res.status(500).json({ error: "ENV belum diisi" });
    }

    const apiRes = await fetch(`https://api.pakasir.com/api/${SLUG}/donate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        amount: Number(amount),
        customer_name: donorName
      })
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(400).json({ error: data.error || "Gagal membuat donasi" });
    }

    return res.status(200).json({
      success: true,
      pay_url: data.pay_url
    });
  } catch (err) {
    console.error("DONATE ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
