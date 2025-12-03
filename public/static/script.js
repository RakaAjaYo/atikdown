const input = document.getElementById("url");
const preview = document.getElementById("preview");
const loading = document.getElementById("loading");
const player = document.getElementById("player");

const author = document.getElementById("author");
const titleTxt = document.getElementById("title");
const dateTxt = document.getElementById("date");

const dlVideo = document.getElementById("dlVideo");
const dlVideoHD = document.getElementById("dlVideoHD");
const dlAudio = document.getElementById("dlAudio");

document.getElementById("btnFetch").onclick = fetchData;
document.getElementById("btnClear").onclick = () => {
  input.value = "";
  preview.style.display = "none";
};

async function fetchData() {
  let url = input.value.trim();
  if (!url) return alert("Tempel link TikTok dulu!");

  loading.style.display = "flex";

  try {
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
    const json = await res.json();

    if (!json.ok) {
      alert(json.error || "Gagal memproses link.");
      loading.style.display = "none";
      return;
    }

    const d = json.result;

    player.src = d.video;
    author.textContent = "@" + d.author;
    titleTxt.textContent = d.title;
    dateTxt.textContent = "Upload: " + (d.date || "-");

    dlVideo.href = d.video;
    dlAudio.href = d.audio;

    if (d.video_hd) {
      dlVideoHD.style.display = "block";
      dlVideoHD.href = d.video_hd;
    } else {
      dlVideoHD.style.display = "none";
    }

    preview.style.display = "block";

  } catch (e) {
    alert("Gagal memuat data.");
  }

  loading.style.display = "none";
}
