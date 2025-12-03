import axios from "axios";

export default async function handler(req, res) {
  const { url, type } = req.query; // type = video / audio
  if (!url || !type) return res.status(400).send("Missing parameters");

  try {
    // Ambil file dari Tikwm / CDN
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    // Generate nama file unik
    const uniqueId = Date.now();
    const ext = type === "audio" ? "mp3" : "mp4";

    // Kirim file ke user dengan header attachment
    res.setHeader("Content-Disposition", `attachment; filename=atikdown_${uniqueId}.${ext}`);
    res.setHeader("Content-Type", type === "audio" ? "audio/mpeg" : "video/mp4");
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
}
