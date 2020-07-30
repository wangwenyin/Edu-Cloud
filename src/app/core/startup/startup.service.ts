import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Menu, MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { ArrayService } from "@shared/utils/array.service";

import { I18NService } from '../i18n/i18n.service';
import { debug } from 'util';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private menuService: MenuService,
    private translate: TranslateService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private httpClient: HttpClient,
    private injector: Injector,
    private arrayService: ArrayService,
  ) { }
  private userPermissions = [];
  private tokenData;
  private viaHttp(resolve: any, reject: any) {

    const url = this.injector.get(Router).url;
    console.log(url);

    //if(url.startsWith(''))

    //判断是否有用户token
    // this.injector.get(Router).navigateByUrl('/home');
    this.tokenData = this.tokenService.get();
    if (!this.tokenData.token) {
      //this.injector.get(Router).navigateByUrl('/passport/login');
      this.injector.get(Router).navigateByUrl('/home');
      resolve({});
      return;
    }

    //获取权限
    var permissionIds = [];
    // tslint:disable-next-line: max-line-length
    this.httpClient.get<any[]>(`/thsuaa/api/sys-users/${this.tokenData.account_id}/allPermissions`, { observe: 'response' }).subscribe(res => {
      permissionIds = res.body.map(function (data) {
        return data.id;
      });
      this.userPermissions = res.body;
      this.aclService.set({ability: permissionIds, role: permissionIds});
  //    this.initMenu();
    });
    if(this.tokenData.account_name == 'admin'){
      // ACL：设置权限为全量,不受限
      this.aclService.setFull(true);
    }

    let data =  {
      lobData: './assets/tmp/img/avatar.png'
    };
    this.httpClient.get<any>('/thsuaa/api/sys-user/avatar/'  + `${this.tokenData.account_id}`, { observe: 'response' }).subscribe((res) =>{
      data = res.body;
        if(!data || !data['lobData']){
          data = {
            lobData: './assets/tmp/img/avatar.png'
          };
        }
      },(error) => {
        
      },() => {
        //设置用户信息
        const user: any = {
          name: this.tokenData.entity_name,
          avatar: data['lobData'],
          email: 'test@qq.com',
          token:  this.tokenData.token
        };
        // 用户信息：包括姓名、头像、邮箱地址
        this.settingService.setUser(user);
      });
    
    zip(
      this.httpClient.get(`./assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('./assets/tmp/app-data.json')
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([langData, appData]) => {
        resolve(null);
        return [langData, appData];
      })
    ).subscribe(([langData, appData]) => {
      // setting language data
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);

      // application data
      const res: any = appData;
      
      this.menuService.add(res.menu);
      // 应用信息：包括站点名、描述、年份
      this.settingService.setApp(res.app);
      // 设置页面标题的后缀
      this.titleService.suffix = res.app.name;
    },
      () => { },
      () => {
        resolve(null);
      });
  }


  private initMenu(){
    // 初始化菜单
    let queryParams = {};
    queryParams['size'] = 10000;
    this.httpClient.get<any[]>(`/thsuaa/api/sys-modules/?sort=orderNum%2Casc&isOk.equals=1`, {params: queryParams ,  observe: 'response'}).subscribe(res => {
      let options = {
        idMapName: 'id',
        parentIdMapName: 'parentModule',
        childrenMapName: 'children',
        cb: function (item) {
            item.text = item.moduleName;
    //        item.i18n = item.moduleCode;
            item.icon = item.moduleIcon;
            item.link = item.moduleUrl;
        }
      }
      let menu =  this.arrayService.arrToTree(res.body, options);
      if(this.tokenData.account_name != 'admin'){
        // 非Admin用户，过滤菜单
        this.filterMenu(menu, null, 1);
      }

      let menuWithNav = {};
      menuWithNav['text'] = "导航菜单";
      menuWithNav['i18n'] = "main_navigation";
      menuWithNav['children'] = menu;
      let arr = [];
      arr.push(menuWithNav);
      this.menuService.add(arr);
    });
  }

  //过滤没有权限的菜单
  private filterMenu(data: any[], parent: any, deep: number) {
    for (let i = data.length-1; i>-1; i--) {
      const item = data[i];
      const childrenVal = item['children'];

      //是否为叶子
      if (childrenVal && childrenVal.length > 0) {
        this.filterMenu(childrenVal, item, deep + 1);
        if(childrenVal.length == 0){
          data.splice(i, 1);
        }
      }else{
        let result = this.findPermission(item, parent, deep);
        if(!result){
          data.splice(i, 1);
        }
      }
    }
  }

  //查看用户在该菜单是否有所属权限
  private findPermission(item: any, parent: any, deep: number): boolean{
    for(let i= 0; i< this.userPermissions.length; i++){
      if(this.userPermissions[i].sysModuleId == item.id){
        return true;
      }
    }
    return false;
  }

  private viaMock(resolve: any, reject: any) {
    const tokenData = this.tokenService.get();
    if (!tokenData.token) {
      this.injector.get(Router).navigateByUrl('/passport/login');
      resolve({});
      return;
    }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789'
    };
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    // 初始化菜单
    this.menuService.add([
      {
        "text": "主导航",
        "i18n": "main_navigation",
        "group": true,
        "hideInBreadcrumb": true,
        "children": [
          {
            "text": "工作面板",
            "i18n": "dashboard",
            "icon": "icon-speedometer",
            "children": [
              {
                "text": "仪表盘V1",
                "link": "/dashboard/v1",
                "i18n": "dashboard_v1"
              },
              {
                "text": "分析页",
                "link": "/dashboard/analysis",
                "i18n": "dashboard_analysis"
              },
              {
                "text": "监控页",
                "link": "/dashboard/monitor",
                "i18n": "dashboard_monitor"
              },
              {
                "text": "工作台",
                "link": "/dashboard/workplace",
                "i18n": "dashboard_workplace"
              }
            ]
          },
          {
            "text": "快捷菜单",
            "i18n": "shortcut",
            "icon": "icon-rocket",
            "shortcut_root": true,
            "children": []
          },
          {
            "text": "系统管理",
            "i18n": "admin",
            "icon": "icon-grid",
            "children": [
              {
                "text": "组织管理",
                "i18n": "organization",
                "icon": "icon-organization",
                "children": [
                  {
                    "text": "人员管理",
                    "i18n": "organization_personnel",
                    "link": "/admin/organization/personnel",
                    "icon": "icon-people"
                  },
                  {
                    "text": "部门管理",
                    "i18n": "organization_department",
                    "link": "/admin/organization/department"
                  },
                  {
                    "text": "岗位管理",
                    "i18n": "organization_duty",
                    "link": "/admin/organization/duty"
                  }
                ]
              },
              {
                "text": "权限管理",
                "i18n": "permission",
                "icon": "icon-grid",
                "children": [
                  {
                    "text": "用户管理",
                    "i18n": "system_user",
                    "link": "/admin/system/users",
                    "icon": "icon-user",
                    "shortcut": true
                  },
                  {
                    "text": "角色管理",
                    "i18n": "system_role",
                    "link": "/admin/system/roles"
                  },
                  {
                    "text": "模块管理",
                    "i18n": "system_module",
                    "link": "/admin/system/modules"
                  }
                ]
              },
              {
                "text": "系统设置",
                "i18n": "system_settings",
                "icon": "icon-settings",
                "children": [
                  {
                    "text": "字典管理",
                    "i18n": "system_dict",
                    "link": "/admin/system/dicts",
                    "shortcut": true
                  },
                  {
                    "text": "全局设置",
                    "i18n": "system_global_settings",
                    "link": "/admin/system/settings"
                  },
                  {
                    "text": "附件清单管理",
                    "i18n": "system_filelist",
                    "link": "/admin/system/filelist"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      //this.viaMock(resolve, reject);
    });
  }
}
