import {NzTreeNode} from "ng-zorro-antd";
import {MockRequest} from "@delon/mock";

const nodes = [
  new NzTreeNode({
    title: '深圳斯维尔科技股份有限公司',
    key: '1001',
    children: [
      {
        title: '研发部',
        key: '10001',
        children: [
          {
            title: '研发一部',
            key: '100011',
            isLeaf: true
          },
          {
            title: '研发二部',
            key: '100012',
            isLeaf: true
          },
          {
            title: '研发三部',
            key: '100013',
            isLeaf: true
          },
          {
            title: '研发四部',
            key: '100014',
            isLeaf: true
          }
        ]
      },
      {
        title: '市场部',
        key: '10002',
        children: [
          {
            title: '市场1部',
            key: '1000121',
            isLeaf: true,
          },
          {
            title: '市场2部',
            key: '1000122',
            isLeaf: true
          },
          {
            title: '市场3部',
            key: '1000123',
            isLeaf: true,
          },
          {
            title: '市场4部',
            key: '1000124',
            isLeaf: true
          }
        ]
      },
      {
        title: '人事部',
        key: '10002',
        children: [
          {
            title: '人事1部',
            key: '1000121',
            isLeaf: true,
          },
          {
            title: '人事2部',
            key: '1000122',
            isLeaf: true
          },
          {
            title: '人事3部',
            key: '1000123',
            isLeaf: true,
          },
          {
            title: '人事4部',
            key: '1000124',
            isLeaf: true
          }
        ]
      },
      {
        title: '财务部',
        key: '10002',
        children: [
          {
            title: '财务1部',
            key: '1000121',
            isLeaf: true,
          },
          {
            title: '财务2部',
            key: '1000122',
            isLeaf: true
          },
          {
            title: '财务3部',
            key: '1000123',
            isLeaf: true
          },
          {
            title: '财务4部',
            key: '1000124',
            isLeaf: true
          }
        ]
      }
    ]
  })
];
const dutyList = [
  {
    key: '1',
    id: '1',
    reportTo: '无',
    deptName: '局长',
    parentDuty: '',
    dutyDesc: '无',
    isOk: '1',
    orgDeptId: '100011',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    id: '2',
    reportTo: '无',
    deptName: '部长',
    parentDuty: '',
    dutyDesc: '无',
    isOk: '0',
    orgDeptId: '100012',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    id: '3',
    reportTo: '无',
    deptName: '工程师',
    parentDuty: '部长',
    dutyDesc: '无',
    isOk: '1',
    orgDeptId: '',
    department: 'Sidney No. 1 Lake Park',
  },
];

function save(duty: any) {
  debugger;
  if (duty.id == null) {
    dutyList.unshift({
        id: (dutyList.length + 1) + '',
        key: (dutyList.length + 1) + '',
        reportTo: duty.reportTo,
        deptName: duty.deptName,
        parentDuty: duty.parentDuty,
        dutyDesc: duty.dutyDesc,
        isOk: duty.isOk,
        orgDeptId: duty.orgDeptId,
        department: duty.department,
      }
    )
  }
}

function removeDuty(id: string): boolean {
  const idx = dutyList.findIndex(w => w.id == id);
  if (idx !== -1) dutyList.splice(idx, 1);
  return true;
}
function getDutyListByDeptId(orgDeptId:string){
  let ret = [...dutyList];
  return ret.filter(data => data.orgDeptId.indexOf(orgDeptId) > -1);

}
export const duty = {
  'GET /duty': nodes,
  '/dutyList': (req: MockRequest) => getDutyListByDeptId(req.queryString.orgDeptId),
  'POST /duty/save': (req: MockRequest) => save(req.body.duty),
  'DELETE /duty/delete': (req: MockRequest) => removeDuty(req.queryString.id),
};
