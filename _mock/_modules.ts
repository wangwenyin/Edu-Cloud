import {MockRequest} from "@delon/mock";
import {NzTreeNode} from "ng-zorro-antd";

const data = [
  {
    id: 1,
    moduleName: '个人事务',
    deptLeader: '张三',
    isOk: '1',
    parentDept: '0',
    orderNum: 1,
    isRunWorkflow: '1',
    moduleEngDesc: 'xxxxxxx',
    children: [
      {
        id: 11,
        moduleName: '用户信息',
        deptLeader: 30,
        isOk: '0',
        parentDept: '1',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
      },
      {
        id: 12,
        moduleName: '待办事宜',
        deptLeader: 30,
        isOk: '0',
        parentDept: '1',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
      },
      {
        id: 13,
        moduleName: '常用意见',
        deptLeader: 30,
        isOk: '0',
        parentDept: '1',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
      }
    ]
  }, {
    id: 2,
    moduleName: '办公管理',
    deptLeader: '钱七',
    isOk: '1',
    parentDept: '0',
    orderNum: 1,
    isRunWorkflow: '1',
    moduleEngDesc: 'xxxxxxx',
    children: [
      {
        id: 21,
        moduleName: '组织机构管理',
        deptLeader: 30,
        isOk: '0',
        parentDept: '2',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
        children: [
          {
            id: 211,
            moduleName: '部门管理',
            deptLeader: 16,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          },
          {
            id: 212,
            moduleName: '人员管理',
            deptLeader: 30,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          }
        ]
      }
    ]
  }, {
    id: 3,
    moduleName: '系统管理',
    deptLeader: '钱七',
    isOk: '1',
    parentDept: '0',
    orderNum: 1,
    isRunWorkflow: '1',
    moduleEngDesc: 'xxxxxxx',
    children: [
      {
        id: 21,
        moduleName: '权限管理',
        deptLeader: 30,
        isOk: '0',
        parentDept: '2',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
        children: [
          {
            id: 211,
            moduleName: '用户管理',
            deptLeader: 16,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          },
          {
            id: 212,
            moduleName: '角色管理',
            deptLeader: 30,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          },
          {
            id: 213,
            moduleName: '模块管理',
            deptLeader: 30,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          }
        ]
      },
      {
        id: 22,
        moduleName: '参数设置',
        deptLeader: 30,
        isOk: '0',
        parentDept: '2',
        orderNum: 1,
        isRunWorkflow: '1',
        moduleEngDesc: 'xxxxxxx',
        children: [
          {
            id: 221,
            moduleName: '字典管理',
            deptLeader: 16,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          },
          {
            id: 222,
            moduleName: '附件管理',
            deptLeader: 30,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          },
          {
            id: 223,
            moduleName: '全局设置',
            deptLeader: 30,
            isOk: '0',
            parentDept: '21',
            orderNum: 1,
            isRunWorkflow: '1',
            moduleEngDesc: 'xxxxxxx',
          }
        ]
      }
    ]
  }
]
const modulesNodes = [
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
    moduleName   : department.moduleName.value,
    deptLeader    : '张三',
    isOk: `London, Park Lane no. ${department.moduleName.value}`
  }];*/
  getArray(data, department.parentDept)
}

function getArray(data, parentDept) {
  for (var i in data) {
    if (data[i].id == parentDept) {
      return data[i];
    } else {
      getArray(data[i].children, name);
    }
  }
}

export const modules = {
  'GET /modules': data,
  'GET /modulesNodes': modulesNodes,
  '/modules/edit': (req: MockRequest) => getDataFromTreeData(req.queryString.id),
  'POST /modules/save': (req: MockRequest) => addDepartment(req.body.modules),
  '/modules/get': (req: MockRequest) => data.find(w => w.id ==req.params.id),
  '/modules/:id': (req: MockRequest) => data.find(w => w.id == +req.params.id),
};
