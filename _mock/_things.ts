import { MockRequest } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const list = [];
const finishedTaskList = [];

for (let i = 0; i < 50; i += 1) {
  list.push({
    id: i + 1+'',
    no: `${i + 1}`,
    thingTitle: `xxxxxxxx${i}`,
    sender:  `曲丽丽 ${i}`,
    sendTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    readTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    isRemind: '是',
    thingType:'流程任务',
    orderNum:100+i,
    isOk:'1',
  });
}
for (let i =51; i < 100; i += 1) {
  finishedTaskList.push({
    id: i + 1+'',
    no: `${i + 1}`,
    thingTitle: `xxxxxxxx${i}`,
    sender:  `曲丽丽 ${i}`,
    sendTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    readTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    isRemind: '是',
    thingType:'流程任务',
    orderNum:100+i,
    isOk:'1',
  });
}
function genData(params: any) {
  let ret = [...list];
  const pi = +params.pi,
    ps = +params.ps,
    start = (pi - 1) * ps;

  if (params.no) {
    ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  }

  return { total: ret.length, list: ret.slice(start, ps * pi) };
}

function updateData(id: number, value: any) {
  const item = list.find(w => w.id === id);
  if (!item) {
    return { msg: '无效用户信息' };
  }
  Object.assign(item, value);
  return { msg: 'ok' };
}
function saveThings(Things:any){
  if(Things.id == null)
    addThings(Things);
  else
    editThings(Things);
}
function addThings(things:any){
  list.unshift({
    id: list.length + 1+'',
    no: `${list.length + 1}`,
    thingTitle: things.thingTitle,
    sender: things.sender,
    sendTime: things.sendTime,
    readTime: things.readTime,
    thingType: things.thingType,
    isRemind: things.isRemind,
    orderNum:1+list.length,
    isOk:things.isOk,
    }
  )
}
function editThings(Things:any){
  let oldThings = list.find(w => w.id = Things.id);
  Object.assign(oldThings, Things);
}

function unFinishTask(params: any){
  debugger;
  let ret = [...list];
  const pi = +params.pi,
    ps = +params.ps,
    start = (pi - 1) * ps;
  if (params.sorter) {
    const s = params.sorter.split('_');
    ret = ret.sort((prev, next) => {
      debugger;
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.thingTitle && params.thingTitle.length > 0) {
    ret = ret.filter(data => data.thingTitle.indexOf(params.thingTitle) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}
function finishedTask(params: any){
  debugger;
  let ret = [...finishedTaskList];
  const pi = +params.pi,
    ps = +params.ps,
    start = (pi - 1) * ps;
  if (params.sorter) {
    const s = params.sorter.split('_');
    ret = ret.sort((prev, next) => {
      debugger;
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.thingTitle && params.thingTitle.length > 0) {
    ret = ret.filter(data => data.thingTitle.indexOf(params.thingTitle) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}
function removeThings(nos: string): boolean {
  debugger;
  nos.split(',').forEach(id => {
    const idx = list.findIndex(w => w.id == id);
    if (idx !== -1) list.splice(idx, 1);
  });
  return true;
}

export const Things = {
  '/Things': (req: MockRequest) => genData(req.queryString),
  '/things/unFinishTask': (req: MockRequest) => unFinishTask(req.queryString),
  '/things/finishedTask': (req: MockRequest) => finishedTask(req.queryString),
  '/Things/get': (req: MockRequest) => list.find(w => w.id == req.queryString.id),
  'POST /Things/save': (req: MockRequest) => saveThings(req.body.thingTitle),
  'DELETE /removeThings': (req: MockRequest) => removeThings(req.queryString.ids),
};
