(()=>{const intro=document.querySelector('[data-intro]');if(!intro)return;const video=intro.querySelector('video');const missing=intro.querySelector('[data-no-video]');const button=intro.querySelector('[data-start-tour]');let error=false;
  const showMissing=()=>{error=true;missing.hidden=false;video.hidden=true;};
  video.addEventListener('error',showMissing);
  video.querySelector('source')?.addEventListener('error',showMissing);
  const start=()=>{intro.hidden=true;video.pause();document.querySelector('[data-stage]')?.focus?.();};
  button.addEventListener('click',start);video.addEventListener('ended',start);
  if(!video.querySelector('source')?.getAttribute('src'))showMissing();
})();
