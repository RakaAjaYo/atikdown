import axios from "axios";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL tidak ditemukan" });
    }

    // API TikTok (gunakan API pihak ketiga)
    const apiURL = `https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`;

    const response = await axios.get(apiURL);

    if (!response.data || !response.data.video) {
      return res.status(500).json({ error: "Gagal mengambil data video" });
    }

    return res.status(200).json({
      author: response.data.author || "Unknown",
      title: response.data.title || "No Title",
      video: response.data.video,
      audio: response.data.music
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
