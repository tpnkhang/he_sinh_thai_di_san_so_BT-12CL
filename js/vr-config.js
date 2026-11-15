/* Each VR page has its own dataset; rendering/control logic is shared. */
(()=>{
const presets={
  'buu-dien-sai-gon':{name:'Bưu điện Trung tâm Sài Gòn',type:'Kiến trúc & di sản',folder:'buu-dien',stations:window.HERITAGE_POST_OFFICE_STATIONS||[]},
  'bao-tang-chien-dich-hcm':{name:'Bảo tàng Chiến dịch Hồ Chí Minh',type:'Lịch sử & ký ức',folder:'chien-dich'},
  'bao-tang-my-thuat-hcm':{name:'Bảo tàng Mỹ thuật TP.HCM',type:'Nghệ thuật & kiến trúc',folder:'my-thuat'}
};
for(const [key,place] of Object.entries(presets)){
  if(place.stations){
    const graph=window.HERITAGE_SCENES?.[key]?.scenes||[];
    place.stations.forEach((station,i)=>{
      const loc=graph[i];if(!loc)return;
      station.panorama=`../assets/images/${place.folder}/${loc.id}/panorama.jpg`;
      station.framesFolder=`../assets/images/${place.folder}/${loc.id}`;
      station.framesCount=Number(loc.count)||0;
    });
    continue;
  }
  const graph=window.HERITAGE_SCENES?.[key]?.scenes||[];
  place.stations=graph.map((s,i)=>({
    id:s.id,zoneNumber:i+1,shortLabel:s.name,title:s.name,description:'Điểm đứng tham quan đề xuất; kiểm tra lại sau khi có ảnh thực địa.',
    mediaType:'image',isCustom:true,panorama:`../assets/images/${place.folder}/${s.id}/panorama.jpg`,
    framesCount:Number(s.count)||0,framesFolder:`../assets/images/${place.folder}/${s.id}`,
    defaultYaw:0,defaultPitch:0,hotspots:s.next.map((id,j)=>({
      id:`goto-${id}`,type:'step',targetStationIndex:graph.findIndex(other=>other.id===id),
      label:graph.find(other=>other.id===id)?.name||id,yaw:[0,35,-35,70,-70][j%5],pitch:-7
    }))
  }));
}
window.HERITAGE_VR_PRESETS=presets;
})();
