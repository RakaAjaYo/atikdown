// api/download.js

const TIKWM_API = "https://www.tikwm.com/api/?url=";

export default async function handler(req, res) {
  try {
    const url = req.method === "GET" ? req.query.url : req.body?.url;

    if (!url) {
      return res.status(400).json({
        ok: false,
        error: "Parameter 'url' wajib.",
      });
    }

    const apiUrl = TIKWM_API + encodeURIComponent(url);

    let apiRes;
    try {
      apiRes = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      });
    } catch (e) {
      console.error("Fetch provider error:", e);
      return res.status(502).json({
        ok: false,
        error: "Gagal terhubung ke provider (TikWM).",
      });
    }

    let json;
    try {
      json = await apiRes.json();
    } catch (e) {
      return res.status(502).json({
        ok: false,
        error: "Gagal membaca respon provider.",
      });
    }

    const payload = json?.data || json;
    if (!payload) {
      console.error("Empty provider payload:", json);
      return res.status(502).json({
        ok: false,
        error: "Respon provider kosong.",
      });
    }

    const normalize = {
      id: payload.id || payload.aweme_id || null,
      author:
        payload.author?.unique_id ||
        payload.author?.nickname ||
        payload.author_name ||
        null,
      nickname:
        payload.author?.nickname ||
        payload.author_name ||
        null,
      title: payload.desc || payload.title || "",
      date: payload.create_time
        ? new Date(payload.create_time * 1000)
            .toISOString()
            .slice(0, 10)
        : null,
      cover:
        payload.cover ||
        payload.video_cover ||
        payload.music_cover ||
        null,
      video:
        payload.play ||
        payload.no_watermark ||
        payload.video ||
        payload.play_addr ||
        null,
      video_hd:
        payload.hdplay ||
        payload.play_hd ||
        null,
      audio:
        payload.music?.play ||
        payload.music?.play_addr ||
        payload.music ||
        null,
      raw: payload,
    };

    if (!normalize.video) {
      console.error("Missing video URL:", payload);
      return res.status(502).json({
        ok: false,
        error: "Provider tidak mengembalikan link video.",
      });
    }

    return res.status(200).json({
      ok: true,
      result: normalize,
    });
  } catch (err) {
    console.error("UNHANDLED ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error.",
    });
  }
}
