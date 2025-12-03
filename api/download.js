// api/download.js
import axios from "axios";

const TIKWM_API = "https://www.tikwm.com/api/"; // atau endpoint lain yang kamu pakai
const AXIOS_TIMEOUT = 15000;

export default async function handler(req, res) {
  try {
    const url = (req.method === "GET" ? req.query.url : req.body?.url) || req.query.url;
    if (!url) {
      return res.status(400).json({ ok: false, error: "Parameter 'url' wajib." });
    }

    // call provider
    const apiUrl = `${TIKWM_API}?url=${encodeURIComponent(url)}`;

    let apiRes;
    try {
      apiRes = await axios.get(apiUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: AXIOS_TIMEOUT,
      });
    } catch (err) {
      console.error("Provider request failed:", err?.toString?.() || err);
      return res.status(502).json({ ok: false, error: "Gagal terhubung ke provider (TikWM). Coba lagi nanti." });
    }

    if (!apiRes?.data) {
      console.error("Empty provider response:", apiRes);
      return res.status(502).json({ ok: false, error: "Respon provider kosong." });
    }

    // provider sometimes returns shape: { code:0, data: {...} } or raw data
    const payload = apiRes.data.data || apiRes.data;
    if (!payload) {
      console.error("Unexpected provider payload:", apiRes.data);
      return res.status(502).json({ ok: false, error: "Format data provider tidak dikenali." });
    }

    // Normalize fields safely (use fallback and guard)
    const normalize = {
      id: payload.id || payload.aweme_id || null,
      author: payload.author ? (payload.author.unique_id || payload.author.nickname) : (payload.author_name || null),
      nickname: payload.author ? payload.author.nickname : (payload.author_name || null),
      title: payload.desc || payload.title || "",
      date: payload.create_time ? new Date((payload.create_time|0) * 1000).toISOString().slice(0,10) : null,
      cover: payload.cover || payload.video_cover || payload.music_cover || null,
      video: payload.play || payload.no_watermark || payload.video || payload.play_addr || null,
      video_hd: payload.hdplay || payload.play_hd || null,
      audio: (payload.music && (payload.music.play || payload.music.play_addr)) || payload.music || null,
      raw: payload
    };

    // Minimal validation: must have at least a video url
    if (!normalize.video) {
      console.error("No video URL in provider response:", payload);
      return res.status(502).json({ ok: false, error: "Provider tidak mengembalikan link video." });
    }

    return res.status(200).json({ ok: true, result: normalize });
  } catch (err) {
    console.error("Unhandled API error:", err?.stack || err);
    return res.status(500).json({ ok: false, error: "Internal server error." });
  }
}
