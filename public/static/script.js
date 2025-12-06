async function previewVideo() {
  const input = document.getElementById("url").value.trim();

  if (!input) return alert("Masukkan URL!");

  document.getElementById("preview").innerHTML = "Loading...";

  try {
    const res = await fetch(`/api/preview?url=${encodeURIComponent(input)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      return document.getElementById("preview").innerHTML =
        `<p style="color:red;">${data.error || "Gagal memuat preview"}</p>`;
    }

    document.getElementById("preview").innerHTML = `
      <img src="${data.cover}" style="width:100%;border-radius:10px;">
      <h3>${data.title}</h3>

      <button onclick="downloadFile('video','${data.video}')">Download Video</button>
      <button onclick="downloadFile('audio','${data.audio}')">Download Audio</button>
    `;
  } catch (err) {
    console.error("Preview error:", err);
    document.getElementById("preview").innerHTML =
      `<p style="color:red;">Server error saat preview.</p>`;
  }
}

function downloadFile(type, url) {
  window.location.href =
    `/api/download?type=${type}&url=${encodeURIComponent(url)}`;
}

async function payDonation() {
  const amount = document.getElementById("donateAmount").value;

  if (!amount || amount < 2000) {
    alert("Minimal donasi 2000");
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
      alert(data.error || "Gagal membuat pembayaran");
      return;
    }

    window.location.href = data.payment_url;

  } catch (err) {
    console.error("Donate error:", err);
    alert("Server error saat membuat pembayaran.");
  }
}
