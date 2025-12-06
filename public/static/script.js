// ===============================
// PREVIEW VIDEO
// ===============================

async function previewVideo() {
  const url = document.getElementById("tiktokUrl").value.trim();
  if (!url) return alert("Masukkan link TikTok!");

  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = `<div class="loading">Loading preview...</div>`;

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      resultContainer.innerHTML = `<p class="error">${data.error || "Gagal mendapatkan preview"}</p>`;
      return;
    }

    const videoUrl = data.video_hd || data.video;
    if (!videoUrl) {
      resultContainer.innerHTML = `<p class="error">Video tidak ditemukan</p>`;
      return;
    }

    resultContainer.innerHTML = `
      <div class="preview-card">
        <img src="${data.cover}" class="preview-thumb">

        <div class="info">
          <h3>${data.title}</h3>
          <p>${data.author} • ${data.date}</p>
        </div>

        <div class="btn-group">
          <button onclick="downloadFile('${encodeURIComponent(videoUrl)}','video')" class="btn">Download Video</button>

          ${
            data.audio
              ? `<button onclick="downloadFile('${encodeURIComponent(data.audio)}','audio')" class="btn">Download Audio</button>`
              : ""
          }
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultContainer.innerHTML = `<p class="error">Terjadi kesalahan. Coba lagi.</p>`;
  }
}



// ===============================
// DIRECT DOWNLOAD TANPA KE CDN
// ===============================

async function downloadFile(url, type) {
  try {
    const res = await fetch(`/api/download?url=${url}&type=${type}`);

    if (!res.ok) {
      alert("Gagal download file");
      return;
    }

    // ambil binary dari api
    const blob = await res.blob();

    // bikin url local browser
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `atikdown_file.${type === "video" ? "mp4" : "mp3"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat download");
  }
}



// ===============================
// DONATE (QRIS PAKASIR)
// ===============================

async function payDonation() {
  const amount = document.getElementById("donateAmount").value;

  if (!amount || amount < 2000) {
    alert("Minimal donasi adalah 2000");
    return;
  }

  const res = await fetch("/api/donate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Number(amount)
    })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Gagal membuat pembayaran");
    return;
  }

  window.location.href = data.payment_url; // redirect ke QRIS
                                         }
