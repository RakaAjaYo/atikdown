async function previewVideo() {
  const inputEl = document.getElementById("tiktokUrl");
  const resultEl = document.getElementById("result");
  const url = inputEl.value.trim();

  // 1. Validasi Input
  if (!url) {
    // Efek getar pada input jika kosong
    inputEl.style.border = "1px solid #ff4d4d";
    setTimeout(() => inputEl.style.border = "", 500);
    return;
  }

  // 2. Tampilkan Loading (Spinner Glass)
  resultEl.innerHTML = `
    <div class="preview-card" style="align-items:center; justify-content:center; min-height:200px;">
      <div class="loader"></div>
      <p style="margin-top:10px; opacity:0.7;">Sedang memproses...</p>
    </div>
  `;

  // Inject CSS loader dinamis (jika belum ada di CSS)
  if (!document.getElementById('dynamic-loader-style')) {
    const style = document.createElement('style');
    style.id = 'dynamic-loader-style';
    style.innerHTML = `
      .loader {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  try {
    // 3. Fetch Data API
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    // 4. Handle Error API
    if (!res.ok || data.error) {
      throw new Error(data.error || "Video tidak ditemukan");
    }

    // 5. Render Hasil (Tema Glassmorphism)
    // Menggunakan data.title sebagai deskripsi, dan fallback jika kosong
    const title = data.title || "Video TikTok Tanpa Judul";
    
    resultEl.innerHTML = `
      <div class="preview-card">
        <div class="video-info">
          <span style="font-size:12px; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:1px;">Ready to Download</span>
        </div>

        <img src="${data.cover}" class="thumbnail" alt="Thumbnail">

        <div class="video-info">
          <p style="color: #fff; font-weight: 500; line-height: 1.4;">${title}</p>
        </div>

        <div class="download-buttons">
          <a class="download-btn primary" 
             href="/api/download?type=video&url=${encodeURIComponent(data.video)}" 
             target="_blank">
             Download Video HD
          </a>
          
          <a class="download-btn" 
             href="/api/download?type=audio&url=${encodeURIComponent(data.audio)}" 
             target="_blank">
             Download Audio (MP3)
          </a>
        </div>
      </div>
    `;

  } catch (err) {
    // Tampilan Error yang Estetik
    resultEl.innerHTML = `
      <div class="preview-card" style="border-color: rgba(255, 77, 77, 0.5); background: rgba(255, 0, 0, 0.1);">
        <h3 style="color: #ffcccc;">Gagal Memuat</h3>
        <p style="color: #ffcccc; opacity: 0.8; font-size: 14px;">${err.message || "Pastikan link TikTok benar atau coba lagi nanti."}</p>
      </div>
    `;
  }
}

// Fitur Tambahan: Auto Paste (Opsional, untuk UX Mobile)
// Cek jika browser mendukung clipboard read saat input diklik
document.getElementById("tiktokUrl").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text.includes("tiktok.com")) {
      document.getElementById("tiktokUrl").value = text;
    }
  } catch (e) {
    // Ignore jika permission ditolak
  }
});
