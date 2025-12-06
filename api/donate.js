export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { amount, name } = req.body;

    if (!amount || !name) {
      return res.status(400).json({ error: "Nama dan amount wajib diisi" });
    }

    const API_KEY = process.env.PAKASIR_API_KEY;
    const SLUG = process.env.PAKASIR_SLUG;

    if (!API_KEY || !SLUG) {
      return res.status(500).json({ error: "API Key atau SLUG tidak ditemukan" });
    }

    const payload = {
      amount: Number(amount),
      customer_name: name
    };

    const apiRes = await fetch(`https://api.pakasir.com/api/${SLUG}/donate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify(payload)
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
    console.error("Donate API ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}
