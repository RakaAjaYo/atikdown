async function previewVideo() {
  const input = document.getElementById("url").value;

  if (!input) return alert("Masukkan URL!");

  const res = await fetch(`/api/preview?url=${encodeURIComponent(input)}`);
  const data = await res.json();

  if (!res.ok) return alert(data.error);

  document.getElementById("preview").innerHTML = `
    <img src="${data.cover}" style="width:100%;border-radius:10px;">
    <h3>${data.title}</h3>

    <button onclick="downloadFile('video','${data.video}')">Download Video</button>
    <button onclick="downloadFile('audio','${data.audio}')">Download Audio</button>
  `;
}

async function downloadFile(type, url) {
  window.location.href = `/api/download?type=${type}&url=${encodeURIComponent(url)}`;
}

async function payDonation() {
  const amount = document.getElementById("donateAmount").value;

  if (!amount || amount < 2000) {
    alert("Minimal donasi adalah 2000");
    return;
  }

  try {
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error(data);
      alert(data.error || "Gagal membuat pembayaran");
      return;
    }

    // redirect ke QRIS pakasir
    window.location.href = data.payment_url;

  } catch (err) {
    console.error("Donate error:", err);
    alert("Server error.");
  }
}
