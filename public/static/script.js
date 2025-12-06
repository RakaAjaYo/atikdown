async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link terlebih dahulu!");

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<p>Loading preview...</p>";

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      resultContainer.innerHTML =
        `<p style="color:red;">${data.error || "Gagal memuat data"}</p>`;
      return;
    }

    const videoUrl = data.video_hd || data.video;
    if (!videoUrl) {
      resultContainer.innerHTML = `<p style="color:red;">Video tidak ditemukan</p>`;
      return;
    }

    resultContainer.innerHTML = `
      <div class="preview-card">
        <img src="${data.cover}" class="thumbnail">
        <div class="video-info">
          <h3>${data.title}</h3>
          <p>@${data.author}</p>
          <p>${data.date}</p>
        </div>

        <div class="download-buttons">
          <a class="download-btn"
             href="/api/download?url=${encodeURIComponent(videoUrl)}&type=video">
             Download Video</a>

          <a class="download-btn"
             href="/api/download?url=${encodeURIComponent(data.audio)}&type=audio">
             Download Audio</a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultContainer.innerHTML = `<p style="color:red;">Terjadi kesalahan.</p>`;
  }
}


async function payDonation() {
  const amount = document.getElementById("donateAmount").value;
  if (!amount || amount < 2000) return alert("Minimal donasi adalah 2000");

  try {
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Gagal membuat pembayaran");
      return;
    }

    // redirect ke QRIS pakasir
    window.location.href = data.payment_url;

  } catch (err) {
    console.error("Donate error:", err);
    alert("Terjadi kesalahan server");
  }
}
