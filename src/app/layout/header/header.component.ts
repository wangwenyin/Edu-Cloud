import { Component, ViewChild, Inject, OnInit, Input, ElementRef, Injector } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { ModalHelper } from '@delon/theme';
import { UserLoginComponent } from '../../routes/passport/login/login.component';
import { TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Input() isVisiteAdmin: boolean;
  @Input() isVisiteRegister: boolean;

  searchToggleStatus: boolean;

  isLogin = false;
  isTeacher = false;
  isStudent = false;
  index = '1';
  form: FormGroup;
  dateNum: number;
  constructor(
    fb: FormBuilder,
    private injector: Injector,
    private routerInfo: ActivatedRoute,
    private router: Router,
    private msg: NzMessageService,
    private elementRef: ElementRef,
    public settings: SettingsService,
    private cacheService: CacheService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private modalHelper: ModalHelper
  ) {
    this.form = fb.group({
      txtSearch: [null],
    });
  }

  ngOnInit() {
    //
    //  if (this.cacheService.getNone('homeIndex') == null){
    //   this.elementRef.nativeElement.querySelector('#homeIndex').click();
    //   this.cacheService.set('homeIndex', true);
    //  }

    this.getSelectIndex();
    this.initIsLogin();
  }


  getSelectIndex() {
    const uri = this.router.url;
    if (uri.indexOf('/home') !== -1) {
      this.index = '1';
      return;
    }
    if (uri.indexOf('/course') !== -1) {
      this.index = '2';
      return;
    }
    if (uri.indexOf('/certification') !== -1) {
      this.index = '3';
      return;
    }
    if (uri.indexOf('/resource') !== -1) {
      this.index = '4';
      return;
    }
  }



  initIsLogin() {
    const token = this.tokenService.get().token;
    if (token && token !== null && token !== '') {
      this.isLogin = true;
      const entityType = this.tokenService.get().entity_type;
      if (entityType === '1') {
        this.isTeacher = true;
      }
      if (entityType === '0' || entityType === '2') {
        this.isStudent = true;
      }
    } else {
      this.isLogin = false;
    }
  }

  loginOut() {
    this.tokenService.clear();
    this.initIsLogin();
  }


  toggleCollapsedSideabar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  openLoginModal() {
    this.modalHelper.open(UserLoginComponent, {}, 482, { nzClassName: 'login-modal' }).subscribe(() => {
      //  let token = this.tokenService.get();
      this.initIsLogin();
    });
  }
  get txtSearch() {
    return this.form.controls.txtSearch;
  }
  // 搜索
  search() {
    this.injector.get(Router).navigateByUrl('/routes/home/search?content=' + this.txtSearch.value);
  }

  // 打开我的消息窗口
  openMyMsg() {
    if (!this.isLogin) {
      this.openLoginModal();
       return ;
    }
    let url = '';

    if (this.isTeacher) {
      url = 'teacher';
    }

    if (this.isStudent) {
      url = 'student';
    }

    this.injector.get(Router).navigateByUrl('/admin/' + url + '/news');

  }

}
