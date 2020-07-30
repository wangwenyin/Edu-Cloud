import { MockRequest, MockStatusError } from '@delon/mock';
import {NzTreeNode} from "ng-zorro-antd";
const userPermissions = [
  new NzTreeNode({
    title   : '系统管理1',
    key     : '1001',
    children: [
      {
        title   : '组织管理',
        key     : '10001',
        children: [
          {
            title   : '人员管理',
            key     : '100012',
            children: [
              {
                title   : '新增',
                key     : '1000121',
                isLeaf  : true,
              },
              {
                title : '修改',
                key   : '1000122',
                isLeaf: true
              },
              {
                title : '删除',
                key   : '1000123',
                isLeaf: true
              }
            ]
          }
        ]
      },
      {
        title   : '权限管理',
        key     : '10002',
        children: [
          {
            title : '用户管理',
            key   : '1000122',
            isLeaf: true
          },
          {
            title : '角色管理',
            key   : '1000123',
            isLeaf: true
          }
        ]
      }
    ]
  }),
  new NzTreeNode({
    title   : '快捷菜单',
    key     : '1002',
    children: [
      {
        title          : '用户管理',
        key            : '10021',
        children       : [
          {
            title : '新增',
            key   : '100211',
            isLeaf: true
          },
          {
            title : '修改',
            key   : '100212',
            isLeaf: true
          },
          {
            title : '删除',
            key   : '100213',
            isLeaf: true
          }
        ],
      },
      {
        title   : '参数管理',
        key     : '10022',
        children: [
          {
            title : '新增',
            key   : '100221',
            isLeaf: true
          },
          {
            title : '修改',
            key   : '100222',
            isLeaf: true
          },
          {
            title : '删除',
            key   : '100223',
            isLeaf: true
          }
        ]
      }
    ]
  })
];
const rolePermissions = [
  new NzTreeNode({
    title   : '系统管理2',
    key     : '1001',
    children: [
      {
        title   : '组织管理',
        key     : '10001',
        children: [
          {
            title   : '人员管理',
            key     : '100012',
            children: [
              {
                title   : '新增',
                key     : '1000121',
                isLeaf  : true,
              },
              {
                title : '修改',
                key   : '1000122',
                isLeaf: true
              },
              {
                title : '删除',
                key   : '1000123',
                isLeaf: true
              }
            ]
          }
        ]
      },
      {
        title   : '权限管理',
        key     : '10002',
        children: [
          {
            title : '用户管理',
            key   : '1000122',
            isLeaf: true
          },
          {
            title : '角色管理',
            key   : '1000123',
            isLeaf: true
          }
        ]
      }
    ]
  }),
  new NzTreeNode({
    title   : '快捷菜单',
    key     : '1002',
    children: [
      {
        title          : '用户管理',
        key            : '10021',
        children       : [
          {
            title : '新增',
            key   : '100211',
            isLeaf: true
          },
          {
            title : '修改',
            key   : '100212',
            isLeaf: true
          },
          {
            title : '删除',
            key   : '100213',
            isLeaf: true
          }
        ],
      },
      {
        title   : '参数管理',
        key     : '10022',
        children: [
          {
            title : '新增',
            key   : '100221',
            isLeaf: true
          },
          {
            title : '修改',
            key   : '100222',
            isLeaf: true
          },
          {
            title : '删除',
            key   : '100223',
            isLeaf: true
          }
        ]
      }
    ]
  })
];
export const permissions = {
  '/userPermissions': userPermissions,
  '/rolePermissions': rolePermissions,
};
