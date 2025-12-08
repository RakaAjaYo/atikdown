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

async function donate() {
  const amount = document.getElementById("amount").value;

  const res = await fetch("/api/donate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();

  if (!data.success) {
    alert("Gagal membuat pembayaran");
    console.log(data);
    return;
  }

  // QRIS Payment Number (untuk ditampilkan jadi QR Code)
  const qrNumber = data.payment.payment_number;

  document.getElementById("result").innerHTML = `
    <p>Order ID: ${data.order_id}</p>
    <p>QRIS Number: ${qrNumber}</p>
  `;
}
