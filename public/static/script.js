async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link TikTok!");

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<p>Loading preview...</p>";

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      resultContainer.innerHTML = `<p style="color:red;">${data.error || "Gagal mendapatkan preview"}</p>`;
      return;
    }

    const videoUrl = data.video_hd || data.video;

    if (!videoUrl) {
      resultContainer.innerHTML = `<p style="color:red;">Video tidak ditemukan</p>`;
      return;
    }

    resultContainer.innerHTML = `
      <div class="preview-card">
        <img src="${data.cover}" alt="Thumbnail" class="thumbnail">
        <div class="video-info">
          <h3>${data.title}</h3>
          <p>Author: ${data.author}</p>
          <p>Date: ${data.date}</p>
        </div>
        <div class="download-buttons">
          <a href="/api/download?url=${encodeURIComponent(videoUrl)}&type=video" class="download-btn">Download Video</a>
          ${data.audio ? `<a href="/api/download?url=${encodeURIComponent(data.audio)}&type=audio" class="download-btn">Download Audio</a>` : ""}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Preview error:", err);
    resultContainer.innerHTML = `<p style="color:red;">Terjadi kesalahan, coba lagi nanti.</p>`;
  }
}


async function payDonation() {
  const amount = document.getElementById("donateAmount").value;

  if (!amount || amount < 2000) {
    alert("Minimal donasi adalah 2000");
    return;
  }

  // kirim request ke backend Vercel
  const res = await fetch("/api/donate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Gagal membuat pembayaran");
    return;
  }

  // Redirect ke halaman QRIS
  window.location.href = data.payment_url;
}
