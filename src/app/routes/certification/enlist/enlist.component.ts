import { Component, OnInit, Inject } from '@angular/core';
import { HttpAddressService } from '@shared/session/http-address.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CertExamineService } from './examine.service';
import { DatePipe } from '@angular/common';
import { CertificationUserService } from '../user/user.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';
import { CertEnlist } from './enlist.model';
import { CertEnlistService } from './enlist.service';
import { CertPayService } from './cert-pay/cert-pay.service';
import { ModalHelper } from '@delon/theme';
import { CertPayComponent } from './cert-pay/cert-pay.component';

@Component({
  selector: 'app-certification-enlist',
  templateUrl: './enlist.component.html'
})
export class EnlistComponent implements OnInit {
  validateForm: FormGroup;
  // 收费金额
  chargeAmount = 0;
  // 认证类型
  type = '';
  // 考试通道ID
  eduCertChannelId = '';
  // 动态加载禁用List
  disabledList = [false, true, true];
  // 当前用户id
  userId = '';
  // 当前用户的认证状态
  certUser: any;
  // 科目list
  subjectList = [];
  // 产品list
  productList = [];
  // 等级list
  gradeList = [];

  // 是否能提交
  isSubmit = false;

  // 去支付按钮
  goPay = false;

  isPay = false;

  order: any;

  loading = false;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private certificationUserService: CertificationUserService,
    private certExamineService: CertExamineService,
    private certEnlistService: CertEnlistService,
    private certPayService: CertPayService,
    private modalHelper: ModalHelper,
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
      this.userId = this.tokenService.get().user_id;
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name            : [ null, [ Validators.required ]],
      nameSpell       : [ null, [ Validators.required ]],
      gender          : [ null, [ Validators.required ]],
      birthday        : [ null, [ Validators.required ]],
      // tslint:disable-next-line: max-line-length
      idCard          : [ null, [ Validators.required, Validators.pattern(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)]],
      mobile          : [ null, [ Validators.required, Validators.pattern(/^1\d{10}$/) ]],
      profession      : [ null, [ Validators.required ]],
      email           : [ null, [ Validators.required , Validators.email] ],
      education       : [ null, [ Validators.required ]],
      examineSubject  : [ null, [ Validators.required ]],
      authProduct     : [ null, [ Validators.required ]],
      authGrade       : [ null, [ Validators.required ]],
      address         : [ null, [ Validators.required ]],
      examineTime     : [ null, [ Validators.required ]],
      examineType     : [ null, [ Validators.required ]],
      chargeType      : [ null, [ Validators.required ]],
    });
    if (this.type === '2') {
      this.validateForm.removeControl('examineSubject');
      this.disabledList[1] = false;
      this.loadAuthProduct('');
    }

    if (this.type === '1') {
      this.getCertExamSubject();
    }
  }

  // 提交表单
  submitForm(): void {
    this.isSubmit = false;
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      this.msg.error('请检查校验信息');
      return;
    }
   // this.isSubmit = true;
    const param = Object.assign({}, this.validateForm.value);
    param.authType = this.type;
    param.eduCertChannelId = this.eduCertChannelId;
    param.certExamineId = param.authGrade.id;
    param.authGrade = param.authGrade.authGrade;
    param.examineTime = param.authGrade.examTime;
    param.birthday =  this.datePipe.transform(param.birthday, 'yyyy-MM-ddTHH:mm:ss') + 'Z',
    // 后台 提交参数
    this.certEnlistService.singUp(param).subscribe(res => {
      const result = res.body;
      if (result.success !== true) {
        this.msg.error(result.message);
      } else {
        this.goPay = true;
        if (result.data.cert_order) {
          this.order = result.data.cert_order;
        }
        this.certUser = result.data.cert_user;
        this.msg.info('报名成功，点击支付开始支付');
      }
    });
    console.log(param);
  }

  get name() {
    return this.validateForm.controls.name;
  }
  get nameSpell() {
    return this.validateForm.controls.nameSpell;
  }
  get gender() {
    return this.validateForm.controls.gender;
  }
  get birthday() {
    return this.validateForm.controls.birthday;
  }
  get idCard() {
    return this.validateForm.controls.idCard;
  }
  get mobile() {
    return this.validateForm.controls.mobile;
  }
  get profession() {
    return this.validateForm.controls.profession;
  }
  get email() {
    return this.validateForm.controls.email;
  }
  get education() {
    return this.validateForm.controls.education;
  }
  get authProduct() {
    return this.validateForm.controls.authProduct;
  }
  get authGrade() {
    return this.validateForm.controls.authGrade;
  }
  get address() {
    return this.validateForm.controls.address;
  }
  get examineTime() {
    return this.validateForm.controls.examineTime;
  }
  get examineType() {
    return this.validateForm.controls.examineType;
  }
  get chargeType() {
    return this.validateForm.controls.chargeType;
  }

  // 获取考试科目
  getCertExamSubject() {
    const param = this.getExamSubjectParam();
    this.certExamineService.queryByDistinctSubject(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
         this.subjectList = reconds;
      }
    });
  }

  // 加载认证产品
  loadAuthProduct(value: string) {
    this.goPay = false;
    const param = this.getAuthProductParam();
    if (this.type === '1') {
      if (!param['examineSubject.equals'] || param['examineSubject.equals'] === '' || param['examineSubject.equals'] === null) {
        return;
      }
    }

    this.certExamineService.queryByDistinctProduct(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.productList = reconds;
        this.validateForm.controls.authProduct.setValue('');
        this.validateForm.controls.authGrade.setValue('');
        this.disabledList[1] = false;
      }
    });
  }

  // 加载认证等级
  loadAuthGrade() {
    this.goPay = false;
    const param = this.getAuthGradeParam();
    if (!param['authProduct.equals'] || param['authProduct.equals'] === '' || param['authProduct.equals'] === null) {
      return;
    }
    this.certExamineService.queryGrade(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.gradeList = reconds;
        this.validateForm.controls.authGrade.setValue('');
        this.disabledList[2] = false;
      }
    });
  }


  private getExamSubjectParam() {
    const param = {
      'isOk.equals': '1',
      'eduCertChannelId.equals': this.eduCertChannelId,
      'registDeadline.greaterThan': this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') + 'Z',
    };
    return param;
  }

  private getAuthProductParam() {
    const param = this.getExamSubjectParam();
    if (this.type === '2') {
      return param;
    }
    param['examineSubject.equals'] = this.validateForm.controls.examineSubject.value;
    return param;
  }

  private getAuthGradeParam() {
    const param = this.getAuthProductParam();
    param['authProduct.equals'] = this.validateForm.controls.authProduct.value;
    return param;
  }

  // 获取用户信息
  loadUserStatus(item: any) {
    const param = {
      'authType.equals': this.type,
      'authProduct.equals': this.validateForm.controls.authProduct.value,
      'authGrade.equals': this.validateForm.controls.authGrade.value.authGrade,
      'userId.equals': this.userId
    };
    const chargeParam = {
      'authType': this.type,
      'authProduct': this.validateForm.controls.authProduct.value,
      'authGrade': this.validateForm.controls.authGrade.value.authGrade,
      'eduUserId': this.userId,
      'examineTime': this.validateForm.controls.authGrade.value.examTime
    };
    if (!param['authGrade.equals'] || param['authGrade.equals'] === '' || param['authGrade.equals'] === null) {
      return;
    }
    if (this.type === '1') {
      param['examineSubject.equals'] = this.validateForm.controls.examineSubject.value;
      chargeParam['examineSubject'] = this.validateForm.controls.examineSubject.value;
    }
    // 加载考试时间
    this.validateForm.controls.examineTime.setValue(this.datePipe.transform(item.examTime, 'yyyy-MM-dd HH:mm'));
    this.certificationUserService.queryPay(param).subscribe(res => {
      const data = res.body.data;
      const reconds = data.cert_user;
      if (data.cert_pay) {
        this.order = data.cert_pay;
      }

      if (!reconds) {
        this.msg.error('您的账号状态异常，请尝试与客服人员联系');
        return;
      }
      if (reconds !== null && reconds.length > 0) {
          this.certUser = reconds[0];
          this.certUser.examineTime =  this.datePipe.transform( this.certUser.examineTime, 'yyyy-MM-dd HH:mm:ss');
          if (this.certUser.status === '3') {
            this.isSubmit = true;
            this.goPay = false;
            this.msg.info('您已通过认证，请勿重复报名');
            return;
          }
          if (this.certUser.status === '1') {
            this.isSubmit = true;
            this.goPay = false;
            this.msg.info('您已报名成功，请等待考试');
          }
          if (this.certUser.status === '2') {
            this.isSubmit = true;
            this.goPay = false;
            this.msg.info('您补考报名已成功，请等待考试');
          }
           // 待支付状态
           if (this.certUser.status === '0') {
            this.isSubmit = false;
            this.goPay = true;
            if (this.certUser.examineTime !== item.examTime) {
              this.msg.error('无法同时报考该考试');
              this.isSubmit = true;
              this.goPay = false;
            }

          }
          // 上次未通过
          if (this.certUser.status === '4') {
             this.isSubmit = false;
             this.goPay = false;
          }
          // 获取考试类型与收费类型
          this.getChargeTypeAndExamineType(chargeParam);
      } else {
        this.isSubmit = false;
        this.certUser  =  {};
        this.goPay = false;
        // 设置考试类型 -- 第一次考试 考试类型为考试
        this.validateForm.controls.examineType.setValue('1');
        // 设置收费类型 -- 第一次考试 收费类型为收费
        this.validateForm.controls.chargeType.setValue('1');
      }
      this.chargeAmount = item.chargeAmount;
    });
  }


  // 获取考试类型 与 收费类型
  getChargeTypeAndExamineType(param: any) {
    this.certEnlistService.isCharge(param).subscribe(res => {
      const result = res.body;
      const isCharge = result.data;
      let tmp = '1';
      if (isCharge === true) {
        // 收费
        tmp = '1';
      } else {
        tmp = '2';
      }
      // 设置考试类型 -- 第一次考试 考试类型为考试
      this.validateForm.controls.examineType.setValue(tmp);
      // 设置收费类型 -- 第一次考试 收费类型为收费
      this.validateForm.controls.chargeType.setValue(tmp);
    });
  }


  // 获取订单最新状态
  getOrderStatus() {
    this.certPayService.find(this.order.id).subscribe(res => {
      const recond = res.body;
      if (recond.status === '1') {
        this.isPay = true;
        this.msg.info('支付成功，可去个人中心查看订单');
        this.goPay = false;
        this.isSubmit = true;
      } else {
        this.msg.info('支付失败，可去个人中心查看订单');
      }

    });

  }


    // 打开购买窗口
  openOrderDetailModal() {
    this.loading = true;
      if (!this.order) {
        this.msg.error('订单状态异常，尝试联系管理人员');
        this.loading = false;
        return;
      }
      this.modalHelper.open(CertPayComponent, {order: this.order }, 960).subscribe(() => {
        // this.ngOnInit();
        this.getOrderStatus();
        this.loading = false;
      });
   }

}
