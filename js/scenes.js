/* Tuyến tham quan ĐỀ XUẤT, không phải sơ đồ định vị đã kiểm chứng.
 * Điền count và kiểm tra đường nối sau khi có ảnh chụp thực tế.
 * Ảnh theo mẫu: assets/images/<địa điểm>/<bối cảnh>/1.jpg ... n.jpg
 */
window.HERITAGE_SCENES={
  'buu-dien-sai-gon':{folder:'buu-dien',scenes:[
    {id:'quang-truong',name:'Quảng trường trước Bưu điện',count:0,next:['mat-tien']},
    {id:'mat-tien',name:'Mặt tiền & lối vào',count:0,next:['quang-truong','cua-chinh']},
    {id:'cua-chinh',name:'Ngưỡng cửa chính',count:0,next:['mat-tien','sanh-giua']},
    {id:'sanh-giua',name:'Sảnh trung tâm mái vòm',count:0,next:['cua-chinh','quay-giao-dich','khu-buu-thiep']},
    {id:'quay-giao-dich',name:'Khu quầy giao dịch',count:0,next:['sanh-giua']},
    {id:'khu-buu-thiep',name:'Khu bưu thiếp & lưu niệm',count:0,next:['sanh-giua']}
  ]},
  'bao-tang-chien-dich-hcm':{folder:'chien-dich',scenes:[
    {id:'cong-bao-tang',name:'Cổng & mặt tiền',count:0,next:['san-trung-bay']},
    {id:'san-trung-bay',name:'Sân trưng bày ngoài trời',count:0,next:['cong-bao-tang','khu-khi-tai','sanh-vao']},
    {id:'khu-khi-tai',name:'Khu khí tài quân sự',count:0,next:['san-trung-bay']},
    {id:'sanh-vao',name:'Sảnh khu trưng bày trong nhà',count:0,next:['san-trung-bay','chien-dich-1975']},
    {id:'chien-dich-1975',name:'Không gian Chiến dịch năm 1975',count:0,next:['sanh-vao','sa-ban']},
    {id:'sa-ban',name:'Khu sa bàn chiến dịch',count:0,next:['chien-dich-1975']}
  ]},
  'bao-tang-my-thuat-hcm':{folder:'my-thuat',scenes:[
    {id:'cong-chinh',name:'Cổng & mặt tiền',count:0,next:['san-trong']},
    {id:'san-trong',name:'Sân trong khu bảo tàng',count:0,next:['cong-chinh','toa-1-sanh','toa-2','toa-3']},
    {id:'toa-1-sanh',name:'Tòa 1 · sảnh & cầu thang',count:0,next:['san-trong','toa-1-trung-bay']},
    {id:'toa-1-trung-bay',name:'Tòa 1 · mỹ thuật hiện đại',count:0,next:['toa-1-sanh']},
    {id:'toa-2',name:'Tòa 2 · trưng bày chuyên đề',count:0,next:['san-trong']},
    {id:'toa-3',name:'Tòa 3 · mỹ thuật cổ – cận hiện đại',count:0,next:['san-trong']}
  ]}
};
