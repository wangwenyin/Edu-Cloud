import {MockRequest} from "@delon/mock";

const list = [];

const dataSet = [
];
for (let i = 1; i < 50; i += 1) {
  dataSet.push({
    key    : i+'',
    itemText   : `字典列表`,
    itemValue1   :  `字典列表`,
    itemValue2   : 'Edward King 0',
    itemValue3   : 'Edward King 0',
    parentItemId   : 'Edward King 0',
    orderNum    : i+'',
    isOk: '1'
  });
}
function getDictList(params: any){
  debugger;
  let ret = [...dataSet];
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
export const dictlist = {
  '/dictlist':dataSet,
  '/getDictList': (req: MockRequest) => getDictList(req.queryString),
};
