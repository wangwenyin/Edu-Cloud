import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  checked = true;
  // tslint:disable-next-line: member-ordering
  count = 0;
  // tslint:disable-next-line: member-ordering
  interval$: any;

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private modal: NzModalRef,
    private httpAddressService: HttpAddressService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    private httpClient: HttpClient
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  get remember() {
    return this.form.controls.remember;
  }
  // endregion

   switch(index: number) {
    this.type = index;
  }

  // region: get captcha


  getCaptcha() {
    this.httpClient.post(this.httpAddressService.EduServe + '/web/sendSMSCode/' + this.mobile.value, {}).subscribe( (val: any) => {
      if (!val || !val.success || val.success !== true) {
        this.msg.error(val.msg);
        return ;
      }
      this.count = 59;
      this.interval$ = setInterval(() => {
        this.count -= 1;
        if (this.count <= 0) clearInterval(this.interval$);
      }, 1000);
    });
  }
  // endregion

  private getLoginParam() {
    // 'rememberMe':this.remember.value
    if (this.type === 0) {
      const param = {
        'userAccount': this.userName.value,
        'userPassword': this.password.value
      };
      return param;
    } else {
      const param = {
        'code': this.captcha.value,
        'mobileCode': this.mobile.value
      };
      return param;
    }
  }

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    //
    // mock http
    this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    //   if (this.type === 0) {
    //     if (
    //       this.userName.value !== 'admin' ||
    //       this.password.value !== '888888'
    //     ) {
    //       this.error = `账户或密码错误`;
    //       return;
    //     }
    //   }

    //   // 清空路由复用信息
    //   this.reuseTabService.clear();
    //   // 设置Token信息
    //   this.tokenService.set({
    //     token: '123456789',
    //     name: this.userName.value,
    //     email: `cipchk@qq.com`,
    //     id: 10000,
    //     time: +new Date(),
    //   });
    //   // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
    //   // this.startupSrv.load().then(() => this.router.navigate(['/']));
    //   // 否则直接跳转
    //   this.router.navigate(['/']);
    // }, 1000);

    // prod http
    // this.router.navigate(['/']);

    if (this.type === 0 || this.type === 1) {
      this.httpClient.post(this.httpAddressService.EduWebServe + '/edu-users/login', this.getLoginParam()).subscribe( (val: any) => {
            if (!val || !val.success || val.success !== true) {
              this.msg.error(val.msg);
              return ;
            }
            // 清空路由复用信息
            this.reuseTabService.clear();
            // 设置Token信息
            this.tokenService.set({
              token: val.token.access_token,
              token_type: val.token.token_type,
              refresh_token: val.token.refresh_token,
              expires_in: val.token.expires_in,
              // scope: val.token.scope,
              // iat: val.iat,
              // jti: val.jti,
              name: val.token.entity_name,
              id: val.token.user_id,
              account_id: val.token.user_id,
              user_id: val.token.user_id,
              user_sex: val.token.sex,
              account_name: val.token.user_account,
              user_account: val.token.user_account,
              entity_id: val.token.entity_id,
              entity_name: val.token.entity_name,
              entity_type: val.token.user_type,
              entity_province: val.token.user_province,
              entity_city: val.token.user_city,
              entity_college: val.token.user_college,
              time: + new Date(),
            });
            this.close();
          //    debugger;
          //    const params = new HttpParams()
          //  .set('page', '0')
          //   .set('size', '20')
          //    .set('sort', 'id,asc');
          //  this.httpClient.get("/thsuaa/api/users")
          //    .subscribe((val: any) => {
          //      console.log(val);
          //    });

            // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
            this.startupSrv.load().then(() => this.router.navigate(['/']));
            // 否则直接跳转
            //this.router.navigate(['/']);
          },
          response => {
            console.log("POST call in error", response);
          },
          () => {
            console.log("The POST observable is now completed.");
            this.loading = false;
          });
    }
  }

  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
    else callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  findPwd() {
    this.modal.destroy();
    this.router.navigate(['passport/find-pwd']);
  }

  thirdPartyLogin() {
    this.modal.destroy();
    this.router.navigate(['passport/bind']);
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }

  close() {
    this.modal.destroy();
  }
}
