export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        const { name, amount } = req.body;

        if (!name || !amount) {
            return res.status(400).json({ error: "Nama dan nominal wajib diisi." });
        }

        // ————————————————
        // API KEY & SLUG PAKASIR
        // ————————————————
        const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";
        const SLUG = "arthurxyz-studios";

        const payload = {
            slug: SLUG,
            amount: Number(amount),
            customer_name: name,
            description: `Donasi dari ${name}`
        };

        const response = await fetch("https://api.pakasir.com/payment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: result?.message || "Gagal membuat pembayaran (server error)."
            });
        }

        return res.status(200).json({
            url: result?.data?.checkout_url
        });

    } catch (err) {
        return res.status(500).json({
            error: "Server error: " + err.message
        });
    }
}
