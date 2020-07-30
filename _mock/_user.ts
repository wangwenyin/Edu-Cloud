import { MockRequest, MockStatusError } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const list = [];
const total = 50;

for (let i = 0; i < total; i += 1) {
  list.push({
    id: i + 1+'',
    //disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    no: `${i + 1}`,
    title: `一个任务名称 ${i}`,
    userName: `曲丽丽 ${i}`,
    entityName:  `曲丽丽 ${i}`,
    userEmail:'8467'+ Math.floor(Math.random() * 1000)+'@126.com',
    orderNum:100+i,
    userPwd:'',
    isLockedOut:'1',
    isOk:'1',
    remark:'xxxxxxxx'+i,
    roleIds:i+'',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
    mobile:'13676995843',
    fax:'36584584'
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
function saveUser(user:any){
  if(user.id == null)
    addUser(user);
  else
    editUser(user);
}
function addUser(user:any){
  list.unshift({
    id: list.length + 1+'',
    no: `${list.length + 1}`,
    title: user.userName,
    userName: user.userName,
    entityName:user.entityName,
    userEmail:user.userName,
    orderNum:1+list.length,
    userPwd:user.userPwd,
    isLockedOut:user.isLockedOut,
    isOk:user.isOk,
    remark:user.remark,
    roleIds:user.roleIds,
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(list.length / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(list.length / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
    mobile:user.mobile,
    fax:user.fax,
    }
  )
}
function editUser(user:any){
  let oldUser = list.find(w => w.id = user.id);
  Object.assign(oldUser, user);
}
function getUserListByRoleId(roleId){
  let ret = [...list];
  return ret.filter(data => data.roleIds == roleId);
}
function getUserList(params: any){
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
  if (params.no) {
    ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  }
  if (params.userName && params.userName.length > 0) {
    ret = ret.filter(data => data.userName.indexOf(params.userName) > -1);
  }
  if (params.entityName) {
    ret = ret.filter(data => data.entityName.indexOf(params.entityName) > -1);
  }
  if (params.userEmail) {
    ret = ret.filter(data => data.userEmail.indexOf(params.userEmail) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}
function removeUser(nos: string): boolean {
  debugger;
  nos.split(',').forEach(id => {
    const idx = list.findIndex(w => w.id == id);
    if (idx !== -1) list.splice(idx, 1);
  });
  return true;
}

export const User = {
  '/user': (req: MockRequest) => genData(req.queryString),
  '/userList': (req: MockRequest) => getUserList(req.queryString),
  '/user/get': (req: MockRequest) => list.find(w => w.id == req.queryString.id),
 // 'POST /user/update:id': (req: MockRequest) => updateData(+req.params.id, req.body),
  'POST /user/save': (req: MockRequest) => saveUser(req.body.user),
  // 支持值为 Object 和 Array
 // 'GET /users': { users: [1, 2], total: 2 },
  // GET 可省略
  // '/users/1': Mock.mock({ id: 1, 'rank|3': '★★★' }),
  // POST 请求
  //'POST /users/1': { uid: 1 },
  // 获取请求参数 queryString、headers、body
  '/qs': (req: MockRequest) => req.queryString.pi,
  // 路由参数
  '/users/:id': (req: MockRequest) => req.params, // /users/100, output: { id: 100 }

  '/getUserListByRoleId': (req: MockRequest) => getUserListByRoleId(req.queryString.roleId),
  'DELETE /removeUser': (req: MockRequest) => removeUser(req.queryString.ids),
  // 发送 Status 错误
  '/404': () => {
    throw new MockStatusError(404);
  },
};
