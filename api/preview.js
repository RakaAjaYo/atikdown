import axios from "axios";

// Fungsi format tanggal (dari timestamp TikTok)
function formatDate(ts) {
  try {
    const date = new Date(ts * 1000); // TikTok timestamp biasanya dalam detik
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  } catch {
    return "-";
  }
}

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL TikTok dibutuhkan" });

  try {
    // Request POST ke Tikwm
    const r = await axios.post(
      "https://tikwm.com/api/",
      new URLSearchParams({ url }), // bentuk form-data
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = r.data;

    if (!data || data.code !== 0 || !data.data) {
      return res.status(200).json({ error: "Link tidak valid / video tidak ditemukan" });
    }

    const d = data.data;

    const videoData = {
      cover: d.cover || "",
      title: d.title || "-",
      author: d.author?.unique_id || d.author || "-",
      date: formatDate(d.create_time),
      video: d.play || null,
      video_hd: d.hdplay || null,
      audio: d.music || null,
    };

    return res.status(200).json(videoData);
  } catch (err) {
    console.error("Tikwm API Error:", err.response?.data || err.message);
    return res.status(200).json({ error: "Server error, coba lagi nanti." });
  }
}
