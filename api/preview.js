import axios from "axios";

async function resolveShortLink(url) {
  try {
    const resp = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    // Kalau redirect 301/302, ambil header location
    if (resp.status === 301 || resp.status === 302) {
      return resp.headers.location;
    }
    return url;
  } catch (err) {
    // Kalau gagal resolve, kembalikan url awal
    return url;
  }
}
