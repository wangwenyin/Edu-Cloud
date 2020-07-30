import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserRegisterComponent } from '../register/register.component';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { WebService } from '../web.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-pwd',
  templateUrl: './find-pwd.component.html',
  styleUrls: ['./find-pwd.component.less']
})
export class FindPwdComponent implements OnInit {

  findWay: string = '';
  step: number = 0;

  count = 0;
  interval$: any;

  isBindSuccess: boolean = false;

  form: FormGroup;

  constructor(private location: Location,
    public msg: NzMessageService,
    private webService: WebService,
    private router: Router,
    fb: FormBuilder) {
    this.form = fb.group({
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, Validators.required],
      email: [null, [Validators.required, Validators.minLength(5)]],
      authCode: [null, Validators.required],
      // tslint:disable-next-line: max-line-length
      newPwd: [null, [Validators.required, Validators.minLength(8), FindPwdComponent.checkPassword.bind(this),  Validators.maxLength(32), Validators.pattern(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}$/)]],
      // tslint:disable-next-line: max-line-length
      confirmPwd: [null, [Validators.required, Validators.minLength(8), FindPwdComponent.passwordEquar , Validators.maxLength(32), Validators.pattern(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}$/)]]
      ,
    });
  }

  // tslint:disable-next-line: member-ordering
  static checkPassword(control: FormControl) {
    if (!control) return null;
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) self.status = 'ok';
    else if (control.value && control.value.length > 5) self.status = 'pass';
    else self.status = 'pool';

    if (self.visible)
      self.progress =
        control.value.length * 10 > 100 ? 100 : control.value.length * 10;
  }

  // tslint:disable-next-line: member-ordering
  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) return null;
    if (control.value !== control.parent.get('newPwd').value) {
      return { equar: true };
    }
    return null;
  }


  // region: fields
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  get email() {
    return this.form.controls.email;
  }
  get authCode() {
    return this.form.controls.authCode;
  }
  get newPwd() {
    return this.form.controls.newPwd;
  }
  get confirmPwd() {
    return this.form.controls.confirmPwd;
  }

  ngOnInit() {
  }

  chooseWay(way) {
    this.findWay = way;
    if (way === 'email') {
      this.step = 1;
    }
  }

  getCaptcha() {
    if ((this.mobile.dirty && this.mobile.errors) || this.mobile.value === null) {
      this.msg.remove();
      this.msg.error('请输入正确的手机号码');
      return;
    }

    this.webService.sendSMSCode(this.mobile.value).subscribe(res => {
      if (!res || !res.success || res.success !== true) {
        this.msg.error(res.msg);
        return ;
      }

      this.count = 59;
      this.interval$ = setInterval(() => {
        this.count -= 1;
        if (this.count <= 0) clearInterval(this.interval$);
      }, 1000);
    });
  }

  mobileSubmit() {
    const param = this.checkAndToParam();
    if (param === '') {
      return;
    }
    this.webService.updatePasswordByMobile(param).subscribe(res => {
      debugger
      if (res && res.body) {
        const result = res.body;
        if (result.code !== '1') {
          this.msg.remove();
          this.msg.error(result.message);
          return;
        }
        this.msg.info('修改成功');
        this.router.navigate(['/home'], { queryParams: { hasFooter: false }})
      }
    });
  }

  checkAndToParam() {
    if (this.findWay  === 'phone') {
      if ((this.mobile.dirty && this.mobile.errors) || this.mobile.value === null) {
        this.msg.remove();
        this.msg.error('请填写正确手机号');
        return '';
      }
      if (this.captcha.dirty && this.captcha.errors) {
        this.msg.remove();
        this.msg.error('请填写验证码');
        return '';
      }
      if ((this.newPwd.dirty && this.newPwd.errors) || this.newPwd.value === null ) {
        this.msg.remove();
        this.msg.error('请确认新密码填写正确');
        return '';
      }
      if (this.confirmPwd.errors) {
        this.msg.remove();
        this.msg.error('请填写确认密码或是否两次密码一致');
        return '';
      }

     const  param = {
      mobileCode: this.mobile.value,
      userPassword: this.newPwd.value,
      confirmPassword: this.confirmPwd.value,
      code: this.captcha.value
     };
     return param;
    }

  }

  nextStep(step) {
    this.step = step;
  }

  confirmEmail() {
    this.isBindSuccess = true;
  }

  goback() {
    this.location.back();
  }

}
