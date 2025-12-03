export default async function handler(req, res) {
  try {
    const url =
      (req.method === "GET" ? req.query.url : req.body?.url) ||
      req.query.url;

    if (!url) {
      return res.status(400).json({
        ok: false,
        error: "Parameter 'url' wajib diisi."
      });
    }

    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(
      url
    )}`;

    let response;
    try {
      response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 15000
      });
    } catch (e) {
      return res.status(502).json({
        ok: false,
        error: "Gagal terhubung ke TikWM (timeout / blokir)."
      });
    }

    const json = await response.json().catch(() => null);

    if (!json || !json.data) {
      return res.status(502).json({
        ok: false,
        error: "Provider mengembalikan data kosong / tidak valid."
      });
    }

    const d = json.data;

    const payload = {
      id: d.id || d.aweme_id,
      author: d.author?.unique_id || d.author?.nickname || "Unknown",
      title: d.title || d.desc || "",
      date: d.created || "",
      cover: d.cover || d.video_cover,
      video: d.play || d.no_watermark,
      video_hd: d.hdplay || null,
      audio: d.music || null
    };

    if (!payload.video) {
      return res.status(502).json({
        ok: false,
        error: "Provider tidak mengembalikan URL video."
      });
    }

    return res.status(200).json({
      ok: true,
      result: payload
    });

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "Server error (internal)."
    });
  }
}
