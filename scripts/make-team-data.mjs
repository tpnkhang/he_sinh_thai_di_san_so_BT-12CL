import fs from 'node:fs';
const source=process.argv[2];if(!source)throw Error('Pass the attached nhom.html file path');
const raw=fs.readFileSync(source,'utf8');
const members=[{name:'Trần Phạm Như Khang',role:'Nhóm trưởng',task:'Lập kế hoạch, điều phối, phân công và theo dõi tiến độ công việc của nhóm.'}];
for(const match of raw.matchAll(/<h3 class="member-name">([^<]+)<\/h3>\s*<p class="member-task">([^<]+)<\/p>/g)){
  members.push({name:match[1],role:'Thành viên',task:match[2].replaceAll('&amp;','&')});
}
if(members.length!==13)throw Error(`Expected 13 team members, got ${members.length}`);
fs.mkdirSync('heritage-blue/data',{recursive:true});
fs.writeFileSync('heritage-blue/data/team.json',JSON.stringify(members,null,2));
console.log('Lưu',members.length,'thành viên và nhiệm vụ từ tài liệu nhóm.');
