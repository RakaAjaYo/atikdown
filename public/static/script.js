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

async function donateNow() {
  const name = document.getElementById("donateName").value;
  const amount = document.getElementById("donateAmount").value;

  const res = await fetch("/api/donate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  window.location.href = data.pay_url;
      }
