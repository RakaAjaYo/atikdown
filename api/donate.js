export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, amount } = req.body;

        // Validasi input
        if (!name || !amount) {
            return res.status(400).json({
                success: false,
                error: "Nama dan nominal wajib diisi."
            });
        }

        if (Number(amount) < 2000) {
            return res.status(400).json({
                success: false,
                error: "Minimal donasi adalah 2000"
            });
        }

        // Data API Pakasir
        const API_KEY = "xmCaAM7PILQ1qU3nQ2q3T58r7m8UXOCM";
        const SLUG = "arthurxyz-studios";

        const payload = {
            slug: SLUG,
            amount: Number(amount),
            customer_name: name,
            description: `Donasi dari ${name}`
        };

        // Request ke API Pakasir
        const response = await fetch("https://api.pakasir.com/payment/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Kalau ada error dari Pakasir
        if (!response.ok || !result?.data?.checkout_url) {
            return res.status(500).json({
                success: false,
                error: result?.message || "Gagal membuat pembayaran."
            });
        }

        // Sukses → kirim URL QRIS ke front-end
        return res.status(200).json({
            success: true,
            payment_url: result.data.checkout_url
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server error: " + err.message
        });
    }
}
