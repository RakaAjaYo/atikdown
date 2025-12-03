import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL TikTok dibutuhkan" });

  try {
    const resp = await axios.get("https://tikwm.com/api?url=" + encodeURIComponent(url), {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = resp.data;

    // Cek struktur array (komunitas)
    let videoUrl = null;
    let audioUrl = null;
    let title = "Unknown";
    let author = "Unknown";
    let thumbnail = "";

    if (data.video && Array.isArray(data.video) && data.video.length > 0) {
      videoUrl = data.video[0];
    }
    if (data.audio && Array.isArray(data.audio) && data.audio.length > 0) {
      audioUrl = data.audio[0];
    }
    if (data.author) {
      author = data.author.nickname || data.author;
    }
    if (data.title) title = data.title;
    if (data.video_cover) thumbnail = data.video_cover;

    if (!videoUrl) return res.status(500).json({ error: "Video tidak ditemukan" });

    return res.status(200).json({
      title,
      author,
      thumbnail,
      video: videoUrl,
      audio: audioUrl
    });

  } catch (err) {
    console.error("Error Tikwm API:", err.message);
    return res.status(500).json({ error: "Gagal fetch dari Tikwm" });
  }
        }
