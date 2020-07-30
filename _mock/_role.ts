import { MockRequest, MockStatusError } from '@delon/mock';
import {NzTreeNode} from "ng-zorro-antd";
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const list = [];
const total = 25;

for (let i = 0; i < total; i += 1) {
  list.push({
    id: i + 1,
    //disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    no: `${i}`,
    roleName: `分管领导 ${i}`,
    roleDesc: `xxxxxxxxxxxx${i}`,
    entityName: '曲丽丽',
    userEmail:'846786763@126.com',
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
const nodes = [
  new NzTreeNode({
    title   : '所有角色',
    key     : '-1',
    children: [
      {
        title   : '分管领导0',
        key     : '0',
        isLeaf: true
      },
      {
        title   : '分管领导1',
        key     : '1',
        isLeaf  : true,
      },
      {
        title   : '分管领导2',
        key     : '2',
        isLeaf  : true,
      },
      {
        title   : '分管领导3',
        key     : '3',
        isLeaf  : true,
      }
    ]
  })
];
const allRoles = [];
for (let i = 0; i < total; i += 1) {
  allRoles.push({
    value: `${i}`,
    label: `分管领导 ${i}`,
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

function saveData(id: number, value: any) {
  const item = list.find(w => w.id === id);
  if (!item) {
    return { msg: '无效用户信息' };
  }
  Object.assign(item, value);
  return { msg: 'ok' };
}

export const role = {
  '/role': (req: MockRequest) => genData(req.queryString),
  '/role/:id': (req: MockRequest) => list.find(w => w.id == +req.params.id),
  'POST /role/:id': (req: MockRequest) => saveData(+req.params.id, req.body),
  // 支持值为 Object 和 Array
  'GET /roles': { roles: [1, 2], total: 2 },
  // GET 可省略
  // '/roles/1': Mock.mock({ id: 1, 'rank|3': '★★★' }),
  // POST 请求
  'POST /roles/1': { uid: 1 },
  // 获取请求参数 queryString、headers、body
  '/qs': (req: MockRequest) => req.queryString.pi,
  // 路由参数
  '/roles/:id': (req: MockRequest) => req.params, // /roles/100, output: { id: 100 }
  '/rolesTree':nodes,
  '/allRoles':allRoles,
  // 发送 Status 错误
  '/404': () => {
    throw new MockStatusError(404);
  },
};
