// api/download.js
export default async function handler(req, res) {
  try {
    const url =
      req.method === "GET"
        ? req.query.url
        : req.body?.url || req.query.url;

    if (!url) {
      return res.status(400).json({
        ok: false,
        error: "URL tiktok wajib diisi."
      });
    }

    const apiUrl = "https://www.tikwm.com/api/?url=" + encodeURIComponent(url);

    let apiRes;
    try {
      apiRes = await fetch(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        method: "GET"
      });
    } catch (err) {
      console.error("Failed connecting to TikWM:", err);
      return res.status(502).json({
        ok: false,
        error: "Tidak bisa terhubung ke server TikWM."
      });
    }

    if (!apiRes.ok) {
      return res.status(502).json({
        ok: false,
        error: "Server TikWM mengembalikan status error."
      });
    }

    const data = await apiRes.json();
    const payload = data.data || data;

    if (!payload) {
      return res.status(502).json({
        ok: false,
        error: "Data dari provider kosong."
      });
    }

    const video =
      payload.play ||
      payload.no_watermark ||
      payload.video ||
      payload.play_addr ||
      null;

    if (!video) {
      return res.status(502).json({
        ok: false,
        error: "Provider tidak mengirim link video."
      });
    }

    const normalize = {
      id: payload.id || payload.aweme_id || null,
      title: payload.desc || payload.title || "",
      cover:
        payload.cover ||
        payload.video_cover ||
        null,
      video,
      video_hd: payload.hdplay || null,
      audio:
        (payload.music && (payload.music.play || payload.music.play_addr)) ||
        null,
      author:
        payload.author?.unique_id ||
        payload.author?.nickname ||
        payload.author_name ||
        null,
      raw: payload
    };

    return res.status(200).json({ ok: true, result: normalize });
  } catch (err) {
    console.error("API crash:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error."
    });
  }
}
