// public/static/script.js
async function fetchPreview(){
  const input = document.getElementById('url');
  const url = input.value.trim();
  const previewEl = document.getElementById('preview');
  const loadingEl = document.getElementById('loading');
  const historyEl = document.getElementById('history');
  const authorEl = document.getElementById('author');
  const titleEl = document.getElementById('title');
  const dateEl = document.getElementById('date');
  const thumbnailEl = document.getElementById('thumbnail');
  const dlVideo = document.getElementById('dlVideo');
  const dlVideoHD = document.getElementById('dlVideoHD');
  const dlAudio = document.getElementById('dlAudio');

  if(!url){ alert('Masukkan link TikTok'); return; }

  loadingEl.style.display = 'flex';
  previewEl.style.display = 'none';

  try{
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`, { method: 'GET' });
    const json = await res.json();

    if(!res.ok || !json.ok){
      // show friendly error in UI
      const msg = json?.error || `Server returned ${res.status}`;
      alert(`Error: ${msg}`);
      console.error("API error:", json);
      loadingEl.style.display = 'none';
      return;
    }

    const r = json.result;
    // populate UI safely
    authorEl.textContent = r.author || r.nickname || '@unknown';
    titleEl.textContent = r.title || '-';
    dateEl.textContent = r.date ? `Uploaded: ${r.date}` : '';
    thumbnailEl.src = r.cover || '';

    // video links
    if(r.video){ dlVideo.href = r.video; dlVideo.style.display='block'; } else dlVideo.style.display='none';
    if(r.video_hd){ dlVideoHD.href = r.video_hd; dlVideoHD.style.display='block'; } else dlVideoHD.style.display='none';
    if(r.audio){ dlAudio.href = r.audio; dlAudio.style.display='block'; } else dlAudio.style.display='none';

    // show preview area
    previewEl.style.display = 'block';
    // save history
    saveHistory(url);
  } catch(err){
    console.error("Fetch preview failed:", err);
    alert("Gagal memproses. Periksa koneksi atau coba lagi nanti.");
  } finally {
    loadingEl.style.display = 'none';
  }
}
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
