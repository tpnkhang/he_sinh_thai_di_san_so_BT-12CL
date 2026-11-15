/* Rebuilt viewer around Three.js, preserving the original Bưu điện images and hotspot coordinates.
 * Other places use numbered frame folders or a stitched panorama.jpg when assets are added.
 */
(()=>{
const root=document.querySelector('[data-vr-app]');if(!root)return;
const config=window.HERITAGE_VR_PRESETS?.[root.dataset.place];if(!config)return;
const $=sel=>root.querySelector(sel),stage=$('[data-stage]'),hotspotLayer=$('[data-hotspots]'),status=$('[data-status]'),list=$('[data-stations]'),info=$('[data-info]');
const stations=config.stations;let current=0,scene,camera,renderer,mesh,texture,mouseDown=false,moved=false,px=0,py=0,startLon=0,startLat=0;
let lon=0,lat=0,wantLon=0,wantLat=0,fov=73,wantFov=73,loadTicket=0,pins=[];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const showStatus=message=>{status.textContent=message;status.hidden=false;};
const hideStatus=()=>{status.hidden=true;};
const setText=(sel,value)=>{const el=$(sel);if(el)el.textContent=value;};
const say=message=>{const toast=$('[data-toast]');toast.textContent=message;toast.classList.add('show');clearTimeout(say.timer);say.timer=setTimeout(()=>toast.classList.remove('show'),3600);};
function loadImage(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error(url));image.src=url;});}
function loadTexture(url){return new Promise((resolve,reject)=>{new THREE.TextureLoader().load(url,resolve,undefined,reject);});}
async function loadFramePreview(st){
  if(!st.framesCount&&!st.frameUrls?.length)return null;
  const urls=st.frameUrls||Array.from({length:Math.min(72,st.framesCount)},(_,i)=>`${st.framesFolder}/${i+1}.jpg`);
  const files=await Promise.all(urls.slice(0,72).map(loadImage));
  const canvas=document.createElement('canvas');canvas.width=4096;canvas.height=2048;
  const ctx=canvas.getContext('2d');const sliceW=canvas.width/files.length;
  files.forEach((image,i)=>{
    const srcW=Math.min(image.width,image.height*sliceW/canvas.height),srcX=(image.width-srcW)/2;
    ctx.drawImage(image,srcX,0,srcW,image.height,i*sliceW,0,sliceW+1,canvas.height);
  });
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace||undefined;return t;
}
async function resolveTexture(st){
  if(st.frameUrls?.length){st._activeProjection='sphere';return loadFramePreview(st);}
  if(st.panorama){try{const t=await loadTexture(st.panorama);st._activeProjection='sphere';return t;}catch{}}
  if(st.framesCount){try{const t=await loadFramePreview(st);st._activeProjection='sphere';return t;}catch{}}
  if(st.imageSrc){st._activeProjection='cylinder';return loadTexture(st.imageSrc);}
  return null;
}
function clearMesh(){if(mesh){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();mesh=null;}if(texture){texture.dispose();texture=null;}}
async function goto(index){
  if(!stations[index])return;current=index;const st=stations[index],ticket=++loadTicket;
  wantLon=lon=st.defaultYaw||0;wantLat=lat=st.defaultPitch||0;setText('[data-scene-name]',st.shortLabel||st.title);setText('[data-counter]',`${index+1} / ${stations.length}`);
  setText('[data-about]',st.description||'Khám phá không gian số tại vị trí này.');
  list.innerHTML='';stations.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='station-option'+(i===index?' selected':'');b.textContent=`${String(i+1).padStart(2,'0')}  ${item.shortLabel||item.title}`;b.addEventListener('click',()=>goto(i));list.append(b);});
  buildPins(st);showStatus('Đang tải không gian…');
  try{
    const t=await resolveTexture(st);if(ticket!==loadTicket){t?.dispose();return;}
    clearMesh();if(!t){showStatus('Điểm đứng này chưa có ảnh VR. Hãy bổ sung panorama.jpg hoặc các ảnh 1.jpg…n.jpg rồi cập nhật js/scenes.js.');return;}
    texture=t;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;
    const geometry=st._activeProjection==='cylinder'?new THREE.CylinderGeometry(65,65,66,96,1,true):new THREE.SphereGeometry(90,64,48);
    geometry.scale(-1,1,1);
    mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));scene.add(mesh);hideStatus();
  }catch{if(ticket===loadTicket){clearMesh();showStatus('Chưa tải được hình ảnh của điểm đứng này. Kiểm tra đúng tên thư mục và ảnh, hoặc chọn một điểm khác.');}}
}
function buildPins(st){hotspotLayer.innerHTML='';pins=[];
  for(const hs of st.hotspots||[]){if(hs.type==='step'&&!stations[hs.targetStationIndex])continue;
    const b=document.createElement('button');b.type='button';b.className='vr-hotspot';b.textContent=hs.type==='step'?'➜':'i';b.title=hs.label||'Điểm tương tác';b.setAttribute('aria-label',hs.label||'Điểm tương tác');
    b.addEventListener('click',event=>{event.stopPropagation();if(hs.type==='step'){goto(hs.targetStationIndex);}else{info.querySelector('strong').textContent=hs.label||'Thông tin';info.querySelector('p').textContent=hs.detail||'';info.hidden=false;}});
    hotspotLayer.append(b);pins.push({el:b,hs});
  }
}
function tick(){requestAnimationFrame(tick);wantLat=clamp(wantLat,-52,52);lon+=(wantLon-lon)*.13;lat+=(wantLat-lat)*.13;fov+=(wantFov-fov)*.15;
  if(camera){if(Math.abs(camera.fov-fov)>.03){camera.fov=fov;camera.updateProjectionMatrix();}
    const phi=THREE.MathUtils.degToRad(90-lat),theta=THREE.MathUtils.degToRad(lon);
    camera.lookAt(50*Math.sin(phi)*Math.cos(theta),50*Math.cos(phi),50*Math.sin(phi)*Math.sin(theta));
    const look=new THREE.Vector3();camera.getWorldDirection(look);
    pins.forEach(({el,hs})=>{const p=THREE.MathUtils.degToRad(90-(hs.pitch||0)),t=THREE.MathUtils.degToRad(hs.yaw||0);
      const position=new THREE.Vector3(45*Math.sin(p)*Math.cos(t),45*Math.cos(p),45*Math.sin(p)*Math.sin(t));
      if(look.dot(position.clone().normalize())<.3){el.hidden=true;return;}position.project(camera);
      const x=(position.x*.5+.5)*stage.clientWidth,y=(-position.y*.5+.5)*stage.clientHeight;
      el.hidden=x<35||x>stage.clientWidth-35||y<65||y>stage.clientHeight-115;
      if(!el.hidden){el.style.left=`${x}px`;el.style.top=`${y}px`;}
    });renderer.render(scene,camera);}
}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();renderer.setSize(w,h);}
async function handleMediaFiles(files){
  if(!files?.length)return;
  say('Đang đọc ảnh và nhóm theo thư mục bối cảnh…');
  const images=[];
  for(const file of Array.from(files)){
    if(/\.zip$/i.test(file.name)){
      if(!window.JSZip){say('Chưa tải được JSZip để đọc tệp ZIP.');continue;}
      try{const zip=await JSZip.loadAsync(file);for(const entry of Object.values(zip.files)){
        if(entry.dir||!/\.(jpg|jpeg|png|webp)$/i.test(entry.name))continue;
        const blob=await entry.async('blob');images.push({path:entry.name,url:URL.createObjectURL(blob)});
      }}catch{say('Không mở được ZIP. Thử giải nén rồi chọn thư mục ảnh.');}
    }else if(/\.(jpg|jpeg|png|webp)$/i.test(file.name)){
      images.push({path:file.webkitRelativePath||file.name,url:URL.createObjectURL(file)});
    }
  }
  if(!images.length){say('Không tìm thấy ảnh JPG, PNG hoặc WEBP hợp lệ.');return;}
  // If the upload has folders for more than one location, only use paths of this location.
  const relevant=images.filter(item=>item.path.toLowerCase().includes(config.folder));
  const selected=relevant.length?relevant:images;
  const groups=new Map();
  selected.forEach(item=>{const parts=item.path.split('/');const key=parts.length>1?parts.at(-2):'canh-moi';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);});
  let loaded=0;
  for(const [folder,group] of groups){
    group.sort((a,b)=>a.path.localeCompare(b.path,undefined,{numeric:true}));
    let st=stations.find(item=>item.id===folder);
    if(!st){st={id:folder,shortLabel:folder.replace(/[-_]/g,' '),title:folder,hotspots:[],defaultYaw:0,defaultPitch:0};stations.push(st);}
    st.frameUrls=group.map(item=>item.url);st.framesCount=group.length;
    st.panorama=null;st.imageSrc=null;loaded+=group.length;
  }
  if(loaded){say(`Đã nạp ${loaded} ảnh trong ${groups.size} bối cảnh.`);goto(stations.findIndex(st=>st.id===groups.keys().next().value));}
}
function init(){
  setText('[data-place-title]',config.name);
  if(typeof THREE==='undefined'){showStatus('Không tải được thư viện Three.js. Kiểm tra kết nối mạng.');return;}
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(fov,1,.1,1000);camera.position.set(0,0,.01);
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch{showStatus('Thiết bị không hỗ trợ WebGL. Hãy thử trình duyệt mới hơn.');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));stage.prepend(renderer.domElement);resize();window.addEventListener('resize',resize);
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;mouseDown=true;moved=false;px=e.clientX;py=e.clientY;startLon=wantLon;startLat=wantLat;stage.setPointerCapture(e.pointerId);});
  stage.addEventListener('pointermove',e=>{if(!mouseDown)return;const dx=e.clientX-px,dy=e.clientY-py;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;wantLon=startLon-dx*.17;wantLat=startLat+dy*.13;});
  stage.addEventListener('pointerup',()=>{mouseDown=false;});stage.addEventListener('pointercancel',()=>{mouseDown=false;});
  stage.addEventListener('wheel',e=>{e.preventDefault();wantFov=clamp(wantFov+Math.sign(e.deltaY)*3,35,95);},{passive:false});
  $('[data-prev]').addEventListener('click',()=>goto(Math.max(0,current-1)));$('[data-next]').addEventListener('click',()=>goto(Math.min(stations.length-1,current+1)));
  $('[data-reset]').addEventListener('click',()=>{wantLon=stations[current]?.defaultYaw||0;wantLat=stations[current]?.defaultPitch||0;wantFov=73;});
  $('[data-zoom-in]').addEventListener('click',()=>wantFov=clamp(wantFov-8,35,95));$('[data-zoom-out]').addEventListener('click',()=>wantFov=clamp(wantFov+8,35,95));
  $('[data-fullscreen]').addEventListener('click',()=>{if(!document.fullscreenElement)root.requestFullscreen?.();else document.exitFullscreen?.();});
  $('[data-menu]').addEventListener('click',()=>root.classList.toggle('drawer-open'));$('[data-info-close]').addEventListener('click',()=>info.hidden=true);
  $('[data-import-folder]').addEventListener('change',event=>handleMediaFiles(event.target.files));
  $('[data-import-zip]').addEventListener('change',event=>handleMediaFiles(event.target.files));
  window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')wantLon-=15;if(e.key==='ArrowRight')wantLon+=15;});
  if(!stations.length){showStatus('Chưa có bối cảnh. Kiểm tra dữ liệu trong js/scenes.js.');}else goto(0);
  tick();
}
init();
})();
