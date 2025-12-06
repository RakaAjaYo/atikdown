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

const form = document.getElementById("donateForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const donorName = document.getElementById("donorName").value;
  const amount = document.getElementById("amount").value;

  resultDiv.innerHTML = "Membuat QRIS...";

  try {
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName, amount })
    });

    const data = await res.json();

    if (res.ok) {
      resultDiv.innerHTML = `<p>Scan QR berikut untuk bayar:</p><img src="${data.qr_url}" alt="QRIS">`;
    } else {
      resultDiv.innerHTML = `<p>Error: ${data.message}</p>`;
    }
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "<p>Terjadi kesalahan.</p>";
  }
});
