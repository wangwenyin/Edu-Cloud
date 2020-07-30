import { MockRequest } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const list = [];
const total = 50;

for (let i = 0; i < total; i += 1) {
  list.push({
    id: i + 1+'',
    no: `${i + 1}`,
    commonIdea: `一个任务名称 ${i}`,
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

function updateCommonIdea(id: number, value: any) {
  const item = list.find(w => w.id === id);
  if (!item) {
    return { msg: '无效用户信息' };
  }
  Object.assign(item, value);
  return { msg: 'ok' };
}
function saveCommonIdea(CommonIdea:any){
  if(CommonIdea.id == null)
    addCommonIdea(CommonIdea);
  else
    editCommonIdea(CommonIdea);
}
function addCommonIdea(commonIdea:any){
  list.unshift({
    id: list.length + 1+'',
    no: `${list.length + 1}`,
    commonIdea: commonIdea.commonIdea,
    orderNum:1+list.length,
    isOk:commonIdea.isOk,
    }
  )
}
function editCommonIdea(CommonIdea:any){
  let oldCommonIdea = list.find(w => w.id = CommonIdea.id);
  Object.assign(oldCommonIdea, CommonIdea);
}
function getCommonIdeaListByRoleId(roleId){
  let ret = [...list];
  return ret.filter(data => data.roleIds == roleId);
}
function getCommonIdeaList(params: any){
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

  if (params.commonIdea && params.commonIdea.length > 0) {
    ret = ret.filter(data => data.commonIdea.indexOf(params.commonIdea) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}
function removeCommonIdea(nos: string): boolean {
  debugger;
  nos.split(',').forEach(id => {
    const idx = list.findIndex(w => w.id == id);
    if (idx !== -1) list.splice(idx, 1);
  });
  return true;
}

export const CommonIdea = {
  '/CommonIdea': (req: MockRequest) => genData(req.queryString),
  '/commonIdeaList': (req: MockRequest) => getCommonIdeaList(req.queryString),
  '/commonIdea/get': (req: MockRequest) => list.find(w => w.id == req.queryString.id),
  'POST /commonIdea/save': (req: MockRequest) => saveCommonIdea(req.body.commonIdea),
  'POST /commonIdea/update': (req: MockRequest) => saveCommonIdea(req.body.commonIdea),
  '/qs': (req: MockRequest) => req.queryString.pi,
  '/getCommonIdeaListByRoleId': (req: MockRequest) => getCommonIdeaListByRoleId(req.queryString.roleId),
  'DELETE /removeCommonIdea': (req: MockRequest) => removeCommonIdea(req.queryString.ids),
};
