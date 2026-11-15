import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root='heritage-blue';
const pages=['index.html','nhom.html','vr/vr-buu-dien.html','vr/vr-chien-dich.html','vr/vr-my-thuat.html'];
let errors=[];
for(const file of pages){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
    const target=match[1];if(/^(https?:|data:|mailto:|tel:)/.test(target))continue;
    const resolved=path.resolve(root,path.dirname(file),target);
    if(!fs.existsSync(resolved)&&!/^.+\.(jpg|mp4)$/i.test(target))errors.push(`${file} → ${target}`);
  }
}
const context={window:{}};
for(const file of ['js/scenes.js','js/vr-postoffice-data.js','js/vr-config.js'])vm.runInNewContext(fs.readFileSync(`${root}/${file}`,'utf8'),context);
for(const [name,place] of Object.entries(context.window.HERITAGE_VR_PRESETS)){
  if(place.stations.length!==6)errors.push(`${name}: expected 6 scenes`);
  for(const station of place.stations)for(const hotspot of station.hotspots||[]){
    if(hotspot.type==='step'&&!place.stations[hotspot.targetStationIndex])errors.push(`${name}: broken hotspot`);
  }
}
for(const file of pages.slice(2)){
  const html=fs.readFileSync(`${root}/${file}`,'utf8');
  if(!html.includes('data-intro')||!html.includes('data-start-tour'))errors.push(`${file}: missing intro`);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`OK: ${pages.length} pages, ${Object.keys(context.window.HERITAGE_VR_PRESETS).length} VR configs, all hotspots valid.`);
