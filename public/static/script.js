async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link TikTok!");

  // Clear result sebelum fetch
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "<p>Loading preview...</p>";

  try {
    // Panggil backend preview.js
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok) {
      resultContainer.innerHTML = `<p style="color:red;">${data.error || "Gagal mendapatkan preview"}</p>`;
      return;
    }

    if (!data.video) {
      resultContainer.innerHTML = `<p style="color:red;">Video tidak ditemukan</p>`;
      return;
    }

    // Render preview card
    resultContainer.innerHTML = `
      <div class="preview-card">
        <img src="${data.thumbnail}" alt="Thumbnail" class="thumbnail">
        <div class="video-info">
          <h3>${data.title}</h3>
          <p>Author: ${data.author}</p>
          <p>Duration: ${data.duration}</p>
        </div>
        <video src="${data.video}" controls></video>
        <div class="download-buttons">
          <a href="${data.video}" download class="download-btn">Download Video</a>
          ${data.audio ? `<a href="${data.audio}" download class="download-btn">Download Audio</a>` : ""}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Preview error:", err);
    resultContainer.innerHTML = `<p style="color:red;">Terjadi kesalahan, coba lagi nanti.</p>`;
  }
}
