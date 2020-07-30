import { Component } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  ActivatedRoute
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent {
  isFetching = false;

  // 是否显示footer
  hasFooter: boolean = true;

  constructor(
    router: Router,
    scroll: ScrollService,
    private routerInfo: ActivatedRoute,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
  ) {
    // scroll to top in change page
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
    const queryParams = this.routerInfo.snapshot.queryParams;
    if (!queryParams.hasFooter && queryParams.hasOwnProperty('hasFooter')) {
      this.hasFooter = queryParams.hasFooter;
    }
  }

  myCallback(e) {
    debugger
  }

}
