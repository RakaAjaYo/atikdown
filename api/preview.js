import axios from "axios";

// Fungsi resolve shortlink vt.tiktok.com / vm.tiktok.com
async function resolveShortLink(url) {
  try {
    const resp = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    if (resp.status === 301 || resp.status === 302) {
      return resp.headers.location;
    }
    return url;
  } catch (err) {
    return url; // fallback ke URL asli
  }
}

export default async function handler(req, res) {
  try {
    let { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL TikTok dibutuhkan" });

    // Resolve shortlink mobile
    if (url.includes("vt.tiktok.com") || url.includes("vm.tiktok.com")) {
      url = await resolveShortLink(url);
    }

    // Fetch Tikwm API
    const resp = await axios.get(
      `https://tikwm.com/api?url=${encodeURIComponent(url)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const data = resp.data?.data || resp.data;

    if (!data) return res.status(200).json({ error: "Video tidak ditemukan" });

    // Ambil video fallback
    const videoUrl = data.video?.no_watermark
                   || data.video?.play_addr
                   || data.video?.wm
                   || data.video?.url
                   || (data.itemInfos?.video?.urls ? data.itemInfos.video.urls[0] : null);

    const audioUrl = data.audio || null;
    const thumbnail = data.video?.cover || data.cover || "";
    const title = data.title || "Unknown";
    const author = data.author?.nickname || data.author || "Unknown";
    const duration = data.video?.duration || "Unknown";

    if (!videoUrl) return res.status(200).json({ error: "Video tidak ditemukan" });

    res.status(200).json({ title, author, thumbnail, video: videoUrl, audio: audioUrl, duration });

  } catch (err) {
    console.error("Tikwm API Error:", err.response?.data || err.message);
    res.status(200).json({ error: "Gagal mengambil data dari Tikwm. Coba lagi nanti." });
  }
}
