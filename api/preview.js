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

    if (!data) return res.status(500).json({ error: "Video tidak ditemukan" });

    // Ambil video no watermark fallback
    let videoUrl = data.video?.no_watermark || data.video?.play_addr || data.video?.wm || null;
    let audioUrl = data.audio || null;
    let title = data.title || "Unknown";
    let author = data.author?.nickname || data.author || "Unknown";
    let thumbnail = data.video?.cover || data.cover || "";

    if (!videoUrl) return res.status(500).json({ error: "Video tidak ditemukan" });

    res.status(200).json({
      title,
      author,
      thumbnail,
      video: videoUrl,
      audio: audioUrl,
      duration: data.video?.duration || "Unknown"
    });

  } catch (err) {
    console.error("Error Tikwm API:", err.message, err.response?.data);
    res.status(500).json({ error: "Gagal fetch dari Tikwm" });
  }
}
