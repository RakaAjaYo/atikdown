// public/static/script.js
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const loadingEl = document.getElementById('loading');
const previewEl = document.getElementById('preview');
const player = document.getElementById('player');
const playOverlay = document.getElementById('playOverlay');

function showLoading(show=true){
  loadingEl.style.display = show ? 'flex' : 'none';
}

function showPreview(show=true){
  previewEl.style.display = show ? 'block' : 'none';
}

// copy / clear / history helpers
function copyURL(){
  const val = document.getElementById('url').value;
  if(!val) return alert('URL kosong');
  navigator.clipboard.writeText(val).then(()=>alert('URL disalin'));
}
function clearURL(){
  document.getElementById('url').value = '';
}
function saveHistory(url){
  if(!url) return;
  let h = JSON.parse(localStorage.getItem('atikdown_history') || '[]');
  h = h.filter(x=>x!==url);
  h.unshift(url);
  if(h.length>10) h = h.slice(0,10);
  localStorage.setItem('atikdown_history', JSON.stringify(h));
  renderHistory();
}
function renderHistory(){
  const container = document.getElementById('history');
  if(!container) return;
  let h = JSON.parse(localStorage.getItem('atikdown_history') || '[]');
  container.innerHTML = h.map(u => `<p><a href="#" onclick="useHistory('${u}');return false;">${u}</a></p>`).join('') || '<p style="color:#9aa4b2">Kosong</p>';
}
function useHistory(url){
  document.getElementById('url').value = url;
  fetchPreview();
}

// dark mode toggle
const modeToggle = document.getElementById('modeToggle');
modeToggle?.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  modeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// fetch preview
async function fetchPreview(){
  const url = document.getElementById('url').value.trim();
  if(!url) return alert('Masukkan link TikTok');
  showLoading(true);
  showPreview(false);

  try{
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
    const j = await res.json();
    if(!j.ok){
      alert(j.error || 'Gagal fetch');
      showLoading(false);
      return;
    }
    const r = j.result;

    // populate UI
    document.getElementById('author').textContent = r.author || r.nickname || '@unknown';
    document.getElementById('title').textContent = r.title || '';
    document.getElementById('date').textContent = r.date ? `Uploaded: ${r.date}` : '';
    // set player src
    player.src = r.video || '';
    player.load();

    // download links
    const dlVideo = document.getElementById('dlVideo');
    const dlVideoHD = document.getElementById('dlVideoHD');
    const dlAudio = document.getElementById('dlAudio');

    if(r.video){ dlVideo.href = r.video; dlVideo.style.display='block'; }
    else dlVideo.style.display='none';

    if(r.video_hd){ dlVideoHD.href = r.video_hd; dlVideoHD.style.display='block'; } else dlVideoHD.style.display='none';
    if(r.audio){ dlAudio.href = r.audio; dlAudio.style.display='block'; } else dlAudio.style.display='none';

    saveHistory(url);
    showPreview(true);
  } catch(err){
    console.error(err);
    alert('Terjadi kesalahan saat mengambil data.');
  } finally{
    showLoading(false);
  }
}

// play overlay handling (show/hide overlay when playing)
playOverlay?.addEventListener('click', ()=>{
  if(player.paused) player.play(); else player.pause();
});
player?.addEventListener('play', ()=>{ playOverlay.style.display='none';});
player?.addEventListener('pause', ()=>{ playOverlay.style.display='flex';});

// remove watermark (simulated)
function removeWM(){
  alert('Fungsi Remove Watermark: simulasi. Untuk hasil nyata perlu backend/third-party service.');
}

// events & init
document.getElementById('btnFetch').addEventListener('click', fetchPreview);
document.getElementById('btnCopy').addEventListener('click', copyURL);
document.getElementById('btnClear').addEventListener('click', clearURL);
document.getElementById('btnHistoryClear')?.addEventListener('click', ()=>{ localStorage.removeItem('atikdown_history'); renderHistory(); });

window.addEventListener('load', ()=>{ renderHistory(); });
