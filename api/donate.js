import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { amount } = req.body;

    const apiRes = await fetch("https://app.pakasir.com/api/transactioncreate/qris", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apikey: process.env.PAKASIR_KEY,
        amount: amount,
        note: "Donation from ATikdown"
      })
    });

    const text = await apiRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.log("RAW RESPONSE:", text);
      return res.status(500).json({ error: "API mengembalikan HTML / bukan JSON" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("DONATE ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
  }
