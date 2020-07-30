import { Component, Inject, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';

@Component({
  selector: 'layout-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class LayoutAdminComponent implements OnInit{
  isFetching = false;
  isTeacher = false;
  isStudent = false;
  index = '1';

  // 访问个人中心时去掉左边导航栏选中状态
  isVisiteAdmin = true;

  constructor(
    private router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) {
    // scroll to top in change page
    const entityType = this.tokenService.get().entity_type;
    if (entityType === '1') {
      this.isTeacher = true;
    }
    if (entityType === '0' || entityType === '2') {
      this.isStudent = true;
    }
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }
  ngOnInit(): void {
    this.getSelectIndex();
  }


  getSelectIndex() {
    const uri = this.router.url;
    if (uri.indexOf('my-course') !== -1) {
      this.index = '1';
      return;
    }

    if (uri.indexOf('courseFavorite') !== -1 || uri.indexOf('question-bank') !== -1) {
      this.index = '2';
      return;
    }

    if (uri.indexOf('account') !== -1) {
      this.index = '3';
      return;
    }

    if (uri.indexOf('news') !== -1) {
      this.index = '4';
      return;
    }

    if (uri.indexOf('studyHistory') !== -1 || uri.indexOf('homework') !== -1) {
      this.index = '5';
      return;
    }
    if (uri.indexOf('examine') !== -1 ) {
      this.index = '6';
      return;
    }

    if (uri.indexOf('recovery') !== -1 ) {
      this.index = '7';
      return;
    }

    if (uri.indexOf('special') !== -1 ) {
      this.index = '8';
      return;
    }
  }



}
