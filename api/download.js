import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL TikTok dibutuhkan" });

  try {
    const resp = await axios.get("https://tikwm.com/api?url=" + encodeURIComponent(url), {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = resp.data.data || resp.data;

    if (!data) return res.status(500).json({ error: "Video tidak ditemukan" });

    // struktur preview
    const preview = {
      title: data.title || "Unknown",
      author: data.author?.nickname || data.author || "Unknown",
      thumbnail: data.video?.cover || data.cover || "",
      video: data.video?.no_watermark || data.video?.watermark || "",
      audio: data.audio || null
    };

    res.status(200).json(preview);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal fetch video" });
  }
      }
