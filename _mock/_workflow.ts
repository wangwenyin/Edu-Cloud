import { MockRequest } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const list = [];

for (let i = 0; i < 50; i += 1) {
  list.push({
    id: i + 1+'',
    no: `${i + 1}`,
    flowName: `xxxxxxxx${i}`,
    moduleName:  `曲丽丽 ${i}`,
    flowType: '是',
    thingType:'流程任务',
    timeLimit:i,
    versionNum:i,
    orderNum:100+i,
    timeLimitUnit:'naturalday',
    isOk:'1',
    startDepts:'',
    startDutys:'',
    startPersons:'',
    flowDesc:'',
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
function saveWorkflow(Workflow:any){
  if(Workflow.id == null)
    addWorkflow(Workflow);
  else
    editWorkflow(Workflow);
}
function addWorkflow(workflow:any){
  list.unshift({
    id: list.length + 1+'',
    no: `${list.length + 1}`,
    flowName: workflow.flowName,
    moduleName: workflow.moduleName,
    flowType: workflow.flowType,
    timeLimit: workflow.timeLimit,
    versionNum: workflow.versionNum,
    isOk:workflow.isOk,
    orderNum:workflow.orderNum,
    startDepts:workflow.startDepts,
    startDutys:workflow.startDutys,
    startPersons:workflow.startPersons,
    flowDesc:workflow.flowDesc,
    }
  )
}
function editWorkflow(Workflow:any){
  let oldWorkflow = list.find(w => w.id = Workflow.id);
  Object.assign(oldWorkflow, Workflow);
}

function getDataList(params: any){
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

  if (params.flowName && params.flowName.length > 0) {
    ret = ret.filter(data => data.flowName.indexOf(params.flowName) > -1);
  }
  if (params.flowType && params.flowType.length > 0) {
    ret = ret.filter(data => data.thingTitle.indexOf(params.flowType) > -1);
  }
  return { total: ret.length, list: ret.slice(start, ps * pi) };
}

function removeWorkflow(nos: string): boolean {
  nos.split(',').forEach(id => {
    debugger;
    const idx = list.findIndex(w => w.id == id);
    if (idx !== -1) list.splice(idx, 1);
  });
  return true;
}

export const Workflow = {
  '/Workflow': (req: MockRequest) => genData(req.queryString),
  '/workflow/list': (req: MockRequest) => getDataList(req.queryString),
  '/Workflow/get': (req: MockRequest) => list.find(w => w.id == req.queryString.id),
  'POST /workflow/save': (req: MockRequest) => saveWorkflow(req.body.workflow),
  'POST /workflow/update': (req: MockRequest) => editWorkflow(req.body.workflow),
  'DELETE /workflow/delete': (req: MockRequest) => removeWorkflow(req.queryString.ids),
};
