import { Component } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';
import { HomeService } from 'app/routes/home/home.service';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class LayoutDefaultComponent {
  isFetching = false;
  bannerList: any[];
  imagePrefix = '';
  pamms = {};
  constructor(
    private router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private homeService: HomeService,
    private httpAddressService: HttpAddressService,
  ) {
    this.imagePrefix = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files/download/';
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
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.getBanner();
  }
  // 获取banner图片
  getBanner() {
    if (this.router.url.indexOf('certification') !== -1) {
      // 认证
      this.pamms['type.equals'] = 2;
    } else {
      // 首页
      this.pamms['type.equals'] = 1;
    }
    this.pamms['isOk.equals'] = 1;
    this.pamms['sort'] = ['createdDate,asc'];
    this.pamms['size'] = 5;
    this.homeService.getbanners(this.pamms).subscribe(res => {
      this.bannerList = res.body;
    });
  }
}
