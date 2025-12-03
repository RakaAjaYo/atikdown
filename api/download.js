import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.query;

  if (!url) return res.status(400).json({ message: "URL required" });

  try {
    // Tikwm API
    const response = await axios.get("https://api.tikwm.com/v1/video", {
      params: {
        url: url
      },
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (response.data && response.data.data) {
      return res.status(200).json({
        author: response.data.data.author.nickname,
        title: response.data.data.title,
        play: response.data.data.play,
        video_no_watermark: response.data.data.video.no_watermark,
        video_watermark: response.data.data.video.watermark
      });
    } else {
      return res.status(500).json({ message: "Failed to fetch video" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
