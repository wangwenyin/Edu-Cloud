import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { HttpAddressService } from '@shared/session/http-address.service';
import { ModalHelper } from '@delon/theme';
import { RegisterProtocolComponent } from '../register-protocol/register-protocol.component';
import { RegisterProtocolService } from '../register-protocol/register-protocol.service';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent implements OnDestroy,OnInit {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };
  eduAgreementId = '';

  isFirst = true;

  // 省份
   province: '';
   // 城市
   city: '';
   // 学校
   college = '';
   // 学历
   hasEducation = true;
   // 教的专业
   hasTeacherProfession = true;
   // 职业类别
   hasJobCategory = true;
   // 昵称是否重复
   hasAccount = false;

  constructor(
    fb: FormBuilder,
    private registerProtocolService: RegisterProtocolService,
    private datePipe: DatePipe,
    private router: Router,
    private httpClient: HttpClient,
    public msg: NzMessageService,
    private httpAddressService: HttpAddressService,
    private modalHelper: ModalHelper
  ) {
    this.form = fb.group({
      nickname : [null, [Validators.required]],
      radioValue : [null, [Validators.required]],
      realname : [null, [Validators.required]],
      // tslint:disable-next-line: max-line-length
      idNum: [null, [Validators.required, Validators.pattern(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)]],
      stuNum: [null, []],
      teacherProfession: [null, []],
      major: [null],
      minor: [null],
      education: [null, []],
      jobCategory: [null, []],
      birthdate: [null, [Validators.required]],
      // tslint:disable-next-line: max-line-length
      email: [null, [Validators.email, Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      // tslint:disable-next-line: max-line-length
      // /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}$/
      // tslint:disable-next-line: max-line-length
      password: [null, [ Validators.required, Validators.minLength(8), Validators.maxLength(32), UserRegisterComponent.checkPassword.bind(this), Validators.pattern(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}$/)]],
      // tslint:disable-next-line: max-line-length
      confirm: [null, [ Validators.required, Validators.minLength(8), Validators.maxLength(32), UserRegisterComponent.passwordEquar ,Validators.pattern(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,32}$/)] ],
      mobilePrefix: ['+86'],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true, [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.getRegisterAgreementId();
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
    if (control.value !== control.parent.get('password').value) {
      return { equar: true };
    }
    return null;
  }


  getRegisterAgreementId() {
    const param = {
      'isOk.equals' : '1',
      'type.equals' : '0'
    };
    this.registerProtocolService.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.eduAgreementId = reconds[0].id;
      }
    });
  }

  // region: fields

  get education() {
    return this.form.controls.education;
  }

  get jobCategory() {
    return this.form.controls.jobCategory;
  }

  get radioValue() {
    return this.form.controls.radioValue;
  }
  get birthdate() {
    return this.form.controls.birthdate;
  }
  get selectedProvince() {
    return this.form.controls.selectedProvince;
  }
  get selectedCity() {
    return this.form.controls.selectedCity;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
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

  get realname() {
    return this.form.controls.realname;
  }
  get nickname() {
    return this.form.controls.nickname;
  }

  get idNum() {
    return this.form.controls.idNum;
  }

  get stuNum() {
    return this.form.controls.stuNum;
  }
  get minor() {
    return this.form.controls.minor;
  }

  get profession() {
    return this.form.controls.profession;
  }

  get teacherProfession() {
    return this.form.controls.teacherProfession;
  }

  get major() {
    return this.form.controls.major;
  }

   switch(index: number) {
    this.type = index;
  }

  // tslint:disable-next-line: member-ordering
  count = 0;
  // tslint:disable-next-line: member-ordering
  interval$: any;

  // 用户名校验
   accountValidator() {
     if (this.nickname.value && this.nickname.value !== null && this.nickname.value !== ''){
      this.httpClient.get(this.httpAddressService.EduServe + '/web/edu-users/' + this.nickname.value).subscribe( (val: any) =>{
        this.hasAccount = val;
      });
     }
  }

  // 获取验证码
  getCaptcha() {
    if (!this.mobile.dirty && this.mobile.errors) {
      this.msg.error('请输入手机号码');
      return;
    }
    this.httpClient.post(this.httpAddressService.EduServe  + '/web/sendSMSCode/' + this.mobile.value, {}).subscribe( (val: any) => {
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

  changeIsFirst(){
     this.isFirst = false;
  }

  // 省市院校回调
  selectFinish(obj: any) {
    this.province = obj.province.name;
    this.city = obj.city.name;
    this.college = obj.college.name;
  }

  // 获取注册参数
  private getResgisterParam() {
    const param = {
      'userAccount': this.nickname.value,
      'personName': this.realname.value,
      'name': this.realname.value,
      'sex' : this.radioValue.value,
      'birthday' : this.datePipe.transform(this.birthdate.value, 'yyyy-MM-dd'),
      'email' : this.email.value,
      'mobile': this.mobile.value,
      'userPassword' : this.password.value,
      'confirm' : this.confirm.value,
      'vCode' : this.captcha.value,
      'province' : this.province,
      'city': this.city,
      'college': this.college,
      'idCard' : this.idNum.value,
      'entityType': this.type + '',
      'eduAgreementId' : this.eduAgreementId
    };

    if (this.type === 0) {
      param['studentNum'] = this.stuNum.value;
      param['extra_profession'] = this.minor.value;
      param['profession'] = this.major.value;
      return param;
    }

    if (this.type === 1 || this.type === 2) {
      param['profession'] = this.form.controls.teacherProfession.value;
      param['education'] = this.form.controls.education.value;
      param['jobCategory'] = this.form.controls.jobCategory.value;
      return param;
    }
  }

  // 学生注册
  private studentRegister(param: any) {
    this.httpClient.post(this.httpAddressService.EduServe  + '/web/edu-student', param).subscribe( (val: any) => {
      if (!val || !val.success || val.success !== true) {
        this.msg.error(val.msg);
        return ;
      } else {
        // mock http
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/passport/register-result']);
        }, 1000);
            }
          });
  }

  // 老师注册
  private teacherRegister(param: any){
    this.httpClient.post(this.httpAddressService.EduServe  + '/web/edu-teacher', param).subscribe( (val: any) => {
      if (!val || !val.success || val.success !== true) {
        this.msg.error(val.msg);
        return ;
      } else {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/passport/register-result']);
        }, 1000);
            }
      });
  }

  // 参数校验
  private checkParam(): boolean {
    if (!this.education.value || this.education.value === null || this.education.value === '') {
      this.msg.error('请检查注册信息是否完整');
      this.hasEducation = false;
      return false;
    } else {
      this.hasEducation = true;
    }
    if (!this.teacherProfession.value || this.teacherProfession.value === null || this.teacherProfession.value === '') {
      this.msg.error('请检查注册信息是否完整');
      this.hasTeacherProfession = false;
      return false;
    } else {
      this.hasTeacherProfession = true;
    }
    if (!this.jobCategory.value || this.jobCategory.value === null || this.jobCategory.value === '') {
      this.msg.error('请检查注册信息是否完整');
      this.hasJobCategory = false;
      return false;
    } else {
      this.hasJobCategory = true;
    }
    return true;
  }


  submit() {
    this.error = '';
    // tslint:disable-next-line: forin
    for (const i in this.form.controls) {
      console.log( this.form.controls[i]);
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      this.msg.error('请检查注册信息是否完整');
      return;
    }
    // console.log(this.form.controls.remember.value);
    if (!this.form.controls.remember.value || this.form.controls.remember.value === null || this.form.controls.remember.value !== true) {
      this.msg.error('请勾选注册协议');
      return;
    }
    const param = this.getResgisterParam();
    if (this.type === 0) {
      this.studentRegister(param);
    }

    if (this.type === 1 || this.type === 2) {
      const checkResult = this.checkParam();
      if (checkResult && checkResult === true){
        if (this.type === 2) {
          this.studentRegister(param);
        }
        if (this.type === 1) {
          this.teacherRegister(param);
        }
      }
    }
  }

  handleNavigate() {
    this.modalHelper.open(RegisterProtocolComponent, {}, 1000, { nzClassName: 'login-modal' }).subscribe(() => {
      //  let token = this.tokenService.get();
        // this.initIsLogin();
      });
    // this.isVisible = true;
    // this.router.navigate(['/passport/register-protocol'], { queryParams: { hasFooter: false }})
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
