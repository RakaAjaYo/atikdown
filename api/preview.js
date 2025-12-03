import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL TikTok dibutuhkan" });

  try {
    const resp = await axios.get(
      `https://tikwm.com/api?url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const data = resp.data?.data || resp.data;

    if (!data) {
      return res.status(200).json({ error: "Video tidak ditemukan" });
    }

    // Cek fallback semua kemungkinan field video
    const videoUrl = data.video?.no_watermark
                  || data.video?.play_addr
                  || data.video?.wm
                  || data.video?.url
                  || null;

    const audioUrl = data.audio || null;
    const thumbnail = data.video?.cover || data.cover || "";
    const title = data.title || "Unknown";
    const author = data.author?.nickname || data.author || "Unknown";
    const duration = data.video?.duration || "Unknown";

    if (!videoUrl) {
      return res.status(200).json({ error: "Video tidak ditemukan" });
    }

    res.status(200).json({
      title,
      author,
      thumbnail,
      video: videoUrl,
      audio: audioUrl,
      duration
    });

  } catch (err) {
    console.error("Tikwm API Error:", err.response?.data || err.message);
    res.status(200).json({ error: "Gagal mengambil data dari Tikwm. Coba lagi nanti." });
  }
  }
