async function previewVideo() {
  const input = document.getElementById("tiktokUrl").value.trim();

  if (!input) return alert("Masukkan URL!");

  document.getElementById("result").innerHTML = "Loading preview...";

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(input)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      document.getElementById("result").innerHTML =
        `<p style="color:red">${data.error}</p>`;
      return;
    }

    document.getElementById("result").innerHTML = `
      <div class="preview-card">
        <img src="${data.cover}" class="thumbnail">

        <div class="video-info">
          <h3>${data.title}</h3>
        </div>

        <div class="download-buttons">
          <a class="download-btn" href="/api/download?type=video&url=${encodeURIComponent(data.video)}">Download Video</a>
          <a class="download-btn" href="/api/download?type=audio&url=${encodeURIComponent(data.audio)}">Download Audio</a>
        </div>
      </div>
    `;
  } catch (err) {
    document.getElementById("result").innerHTML =
      `<p style="color:red">Server error preview</p>`;
  }
}

async function payDonation() {
  const name = document.getElementById("donateName").value.trim();
  const amount = document.getElementById("donateAmount").value.trim();

  if (!name) return alert("Nama wajib diisi.");
  if (!amount || amount < 2000) return alert("Minimal donasi 2000");

  try {
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.error || "Gagal membuat pembayaran");
      return;
    }

    window.location.href = data.payment_url; // redirect ke QRIS Pakasir
  } catch (err) {
    alert("Fetch failed — kemungkinan API tidak dijangkau.");
    console.error(err);
  }
}
