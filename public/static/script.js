function downloadVideo() {
  const url = document.getElementById('tiktokUrl').value;
  if (!url) return alert('Masukkan link TikTok!');

  fetch(`/api/download?url=${encodeURIComponent(url)}`)
    .then(res => res.json())
    .then(data => {
      if (data.video_no_watermark) {
        document.getElementById('result').innerHTML = `
          <h3>${data.title}</h3>
          <video src="${data.video_no_watermark}" controls></video>
          <a href="${data.video_no_watermark}" download class="download-btn">Download Video</a>
        `;
      } else {
        alert('Gagal mengambil video!');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Terjadi kesalahan, coba lagi.');
    });
}

// Contoh popup muncul 5 detik
setTimeout(() => {
  document.getElementById('popup-ads').style.display = 'block';
}, 5000);
