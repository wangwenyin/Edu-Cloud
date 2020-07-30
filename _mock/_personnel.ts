import {MockRequest} from "@delon/mock";
const tab1 = [

];

const tab2 = [

];

for (let i = 1; i < 50; i += 1) {
  tab1.push({
    id:''+i,
    num: ''+i,
    perName: '段誉'+i,
    mobile:'18658695'+Math.floor(Math.random() * 1000),
    perSex:'男',
    perBirthday:new Date(`2017-07-${Math.floor(i / 2) + 1}`)+'',
    idnum:''+Math.floor(Math.random() * 1000),
    postTitle:'攻城师',
    registrationNum:'',
    eduLevel:'专科',
    eduCollege:'社会大学',
    workUnit:'',
    workAddress:'',
    officePhone:'',
    officeFax:'56328'+Math.floor(Math.random() * 1000),
    hostPost:'',
    deputyPost:'',
    orderNum: '001'+Math.floor(Math.random() * 1000),
    remark:'测试数据',
  });
}
for (let i = 51; i < 64; i += 1) {
  tab2.push({
    id:''+i,
    num: ''+i,
    perName: '段誉'+i,
    mobile:'18658695'+Math.floor(Math.random() * 1000),
    perSex:'男',
    perBirthday:new Date(`2017-07-${Math.floor(i / 2) + 1}`)+'',
    idnum:''+Math.floor(Math.random() * 1000),
    postTitle:'攻城师',
    registrationNum:'',
    eduLevel:'专科',
    eduCollege:'社会大学',
    workUnit:'',
    workAddress:'',
    officePhone:'',
    officeFax:'56328'+Math.floor(Math.random() * 1000),
    hostPost:'',
    deputyPost:'',
    orderNum: '001'+Math.floor(Math.random() * 1000)/4,
    remark:'测试数据',
  });
}

function addPersonnel(personnel:any){
  //tab1.push({
  tab1.unshift({
    id: (tab1.length+1)+'',
    num: (tab1.length+1)+'',
    perName: personnel.perName,
    mobile:personnel.mobile,
    perSex:personnel.perSex,
    perBirthday:personnel.perBirthday,
    idnum:(tab1.length+1)+'',
    postTitle:personnel.postTitle,
    registrationNum:personnel.registrationNum,
    eduLevel:personnel.eduLevel,
    eduCollege:personnel.eduCollege,
    workUnit:personnel.workUnit,
    workAddress:personnel.workAddress,
    officePhone:personnel.officePhone,
    officeFax:personnel.officeFax,
    hostPost:personnel.hostPost,
    deputyPost:personnel.deputyPost,
    orderNum: personnel.orderNum,
    remark:personnel.remark,
    }
  )
}
function editPersonnel(newPersonnel:any){
  console.log("newPerson:"+newPersonnel.id);
   let personnel = tab1.find(w => w.id = newPersonnel.id);
  Object.assign(personnel, newPersonnel);
}
function removeRule(nos: string): boolean {
  nos.split(',').forEach(id => {
    const idx = tab1.findIndex(w => w.id == id);
    if (idx !== -1) tab1.splice(idx, 1);
  });
  return true;
}

function getService(params: any,tabIndex:string) {
  debugger;
  let ret =null;
  if(tabIndex=='tab1'){
    ret =  [...tab1]
  }
  if(tabIndex=='tab2'){
    ret =  [...tab2]
  }
  const pi = +params.pi,
    ps = +params.ps,
    start = (pi - 1) * ps;
  if (params.sorter) {
    const s = params.sorter.split('_');
    ret = ret.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }
  if (params.perName && params.perName.length > 0) {
    ret = ret.filter(data => data.perName.indexOf(params.perName) > -1);
  }
  if (params.mobile) {
    ret = ret.filter(data => data.mobile.indexOf(params.mobile) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}

export const PERSONNEL = {
  'GET /personnelInService': tab1,
  '/personnel/inService': (req: MockRequest) => getService(req.queryString,'tab1'),
  '/personnel/outService': (req: MockRequest) => getService(req.queryString,'tab2'),
  'GET /personnelTab2': tab2,
  'DELETE /personnelInService': (req: MockRequest) => removeRule(req.queryString.nos),
  '/personnelTab1/:id': (req: MockRequest) => tab1.find(w => w.id == req.params.id),
  'POST /personnel/save': (req: MockRequest) => addPersonnel(req.body.personnel),
  'POST /personnel/update': (req: MockRequest) => editPersonnel(req.body.personnel),
};
