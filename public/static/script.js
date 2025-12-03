async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link TikTok!");

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<p>Loading preview...</p>";

  try {
    // Panggil backend preview.js
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    // Handle error dari backend
    if (!res.ok || data.error) {
      resultContainer.innerHTML = `<p style="color:red;">${data.error || "Gagal mendapatkan preview"}</p>`;
      return;
    }

    // Pilih video HD jika tersedia, fallback ke video biasa
    const videoUrl = data.video_hd || data.video;

    if (!videoUrl) {
      resultContainer.innerHTML = `<p style="color:red;">Video tidak ditemukan</p>`;
      return;
    }

    // Render preview card
    resultContainer.innerHTML = `
      <div class="preview-card">
        <img src="${data.cover}" alt="Thumbnail" class="thumbnail">
        <div class="video-info">
          <h3>${data.title}</h3>
          <p>Author: ${data.author}</p>
          <p>Date: ${data.date}</p>
        </div>
        <video src="${videoUrl}" controls></video>
        <div class="download-buttons">
          <a href="${videoUrl}" download class="download-btn">Download Video</a>
          ${data.audio ? `<a href="${data.audio}" download class="download-btn">Download Audio</a>` : ""}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Preview error:", err);
    resultContainer.innerHTML = `<p style="color:red;">Terjadi kesalahan, coba lagi nanti.</p>`;
  }
}
