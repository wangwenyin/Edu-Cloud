import {MockRequest} from "@delon/mock";
import {NzTreeNode} from "ng-zorro-antd";

const data = [
  {
    id: 0,
    deptName: '深圳斯维尔科技股份有限公司',
    deptLeader: '张三',
    isOk: '有效',
    parentDept: '',
    orderNum: 1,
    isOrg: '1',
    deptDesc: 'xxxxxxx',
    children: [
      {
        id: 1,
        deptName: '研发部',
        deptLeader: '张三',
        isOk: '有效',
        parentDept: '0',
        orderNum: 1,
        isOrg: '1',
        deptDesc: 'xxxxxxx',
        children: [
          {
            id: 11,
            deptName: '研发1部',
            deptLeader: 30,
            isOk: 'New York No. 3 Lake Park',
            parentDept: '1',
            orderNum: 1,
            isOrg: '1',
            deptDesc: 'xxxxxxx',
            children: [
              {
                id: 111,
                deptName: '研发1组',
                deptLeader: 16,
                isOk: 'New York No. 3 Lake Park',
                parentDept: '11',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              },
              {
                id: 112,
                deptName: '研发2组',
                deptLeader: 30,
                isOk: 'New York No. 3 Lake Park',
                parentDept: '11',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              },
              {
                id: 113,
                deptName: '研发3组',
                deptLeader: 72,
                isOk: 'London No. 1 Lake Park',
                parentDept: '11',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              }
            ]
          }
        ]
      }, {
        id: 2,
        deptName: '市场部',
        deptLeader: '钱七',
        isOk: '有效',
        parentDept: '0',
        orderNum: 1,
        isOrg: '1',
        deptDesc: 'xxxxxxx',
        children: [
          {
            id: 21,
            deptName: '市场1部',
            deptLeader: 30,
            isOk: 'New York No. 3 Lake Park',
            parentDept: '2',
            orderNum: 1,
            isOrg: '1',
            deptDesc: 'xxxxxxx',
            children: [
              {
                id: 211,
                deptName: '市场1组',
                deptLeader: 16,
                isOk: 'New York No. 3 Lake Park',
                parentDept: '21',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              },
              {
                id: 212,
                deptName: '市场2组',
                deptLeader: 30,
                isOk: 'New York No. 3 Lake Park',
                parentDept: '21',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              },
              {
                id: 213,
                deptName: '市场3组',
                deptLeader: 72,
                isOk: 'London No. 1 Lake Park',
                parentDept: '21',
                orderNum: 1,
                isOrg: '1',
                deptDesc: 'xxxxxxx',
              }
            ]
          }
        ]
      }
    ]
  }
]
const departmentNodes = [
  new NzTreeNode({
    title: '研发部',
    key: '1001',
    children: [
      {
        title: '研发1部',
        key: '10001',
        children: [
          {
            title: '研发1组',
            key: '100011',
            children: []
          },
          {
            title: '研发2组',
            key: '100012',
            children: []
          }
        ]
      }
    ]
  }),
  new NzTreeNode({
    title: '市场部',
    key: '1002',
    children: [
      {
        title: '市场1部',
        key: '10021',
        children: [{
          title: '市场1组',
          key: '100221',
          isLeaf: true
        }],
        disableCheckbox: true
      },
      {
        title: '市场2部',
        key: '10022',
        children: [
          {
            title: '市场2组',
            key: '100221',
            isLeaf: true
          }
        ]
      }
    ]
  })
];

function getDataFromTreeData(id: any) {
  console.log("请求参数为：" + id);
}

function addDepartment(department: any) {
  /*this.data = [ ...this.data, {
    id    : '111',
    deptName   : department.deptName.value,
    deptLeader    : '张三',
    isOk: `London, Park Lane no. ${department.deptName.value}`
  }];*/
  getArray(data,department.parentDept)
}

function getArray(data,parentDept)
{
  for (var i in data) {
    if (data[i].id == parentDept) {
      return data[i];
    } else {
      getArray(data[i].children, name);
    }
  }
}

export const department = {
  'GET /department': data,
  'GET /departmentNodes': departmentNodes,
  '/department/edit': (req: MockRequest) => getDataFromTreeData(req.queryString.id),
  'POST /department/save': (req: MockRequest) => addDepartment(req.body.department),
};
