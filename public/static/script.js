async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link TikTok!");

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (res.ok && data.video) {
      document.getElementById("result").innerHTML = `
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
    } else {
      alert("Gagal mendapatkan preview: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan, coba lagi nanti.");
  }
}
