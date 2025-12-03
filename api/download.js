export const config = {
  runtime: "edge",
};

const TIKWM_API = "https://www.tikwm.com/api/?url=";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return new Response(
        JSON.stringify({ ok: false, error: "Parameter 'url' wajib." }),
        { status: 400 }
      );
    }

    const apiUrl = TIKWM_API + encodeURIComponent(url);

    let apiRes;
    try {
      apiRes = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        cache: "no-cache",
      });
    } catch (e) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Tidak bisa terhubung ke provider.",
        }),
        { status: 502 }
      );
    }

    let json;
    try {
      json = await apiRes.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Provider mengirim respon invalid.",
        }),
        { status: 502 }
      );
    }

    const payload = json?.data || json;
    if (!payload) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Respon provider kosong.",
        }),
        { status: 502 }
      );
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
        ? new Date(payload.create_time * 1000).toISOString().slice(0, 10)
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
      video_hd: payload.hdplay || payload.play_hd || null,
      audio:
        payload.music?.play ||
        payload.music?.play_addr ||
        payload.music ||
        null,
      raw: payload,
    };

    if (!normalize.video) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Provider tidak mengembalikan link video.",
        }),
        { status: 502 }
      );
    }

    return new Response(JSON.stringify({ ok: true, result: normalize }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "Internal server error." }),
      { status: 500 }
    );
  }
}
