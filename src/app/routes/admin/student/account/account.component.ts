import { Component, OnInit, Inject } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { StuAccountService } from './account.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
import { DatePipe } from '@angular/common';
import { AdminComponent } from '../../admin.component';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class StudentAccountComponent implements OnInit {
  form: FormGroup;
  headImgList: UploadFile[] = [];
  headImgBase64 = '';
  studentImgBase64 = '';
  headFileParam = {
    type: '0'
  };
  studentFileParam = {
    type: '1'
  };
  uploadAddress = '';
  error = '';
  // 省份
  province: '';
   // 城市
  city: '';
  // 学校
  college: '';

  // 0: 学生 2：面向社会学生
  entityType = '';

  isBind = false;

  schools = [];

  constructor(
    fb: FormBuilder,
    public msg: NzMessageService,
    private sanitizer: DomSanitizer,
    private httpAddressService: HttpAddressService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private accountService: StuAccountService,
    private titleService: Title,
    private datePipe: DatePipe,
    private adminComponent: AdminComponent,
  ) {
    this.form = fb.group({
    nickname: [null,  []],
    mobile: [null, [Validators.required]],
    userAccount : [null, [Validators.required]],
    sex : [null, [Validators.required]],
    name : [null, [Validators.required]],
    idCard: [null, [Validators.required]],
    profession: [null, [Validators.required]],
    extraProfession: [null, [Validators.required]],
    education: [null, [Validators.required]],
    birthday: [null, [Validators.required]],
    career: [null, [Validators.required]],
    remark: [null, []],
    signature: [null, [Validators.maxLength(50)]],
  });
  /* this.schools[0] = tokenService.get().entity_province;
  this.schools[1] = tokenService.get().entity_city;
  this.schools[2] = tokenService.get().entity_college; */
  this.uploadAddress = httpAddressService.EduServe + '/edu-users/headImg/upload';
}

  ngOnInit() {
    this.titleService.setTitle('个人中心');
    this.loadData();
    this.loadHeadImg();

  }
  loadData() {
   const userId = this.tokenService.get().account_id;
    this.accountService.getStudentInfo(userId).subscribe(res => {
      const record = res.body;
      if (record.success &&  record.success === true) {
        const val = record.data[0];
        this.form.controls.userAccount.setValue(val.userAccount);
        this.form.controls.nickname.setValue(val.nickname);
        this.form.controls.mobile.setValue(val.mobile);
        this.form.controls.sex.setValue(val.sex);
        this.form.controls.name.setValue(val.name);
        this.form.controls.idCard.setValue(val.idCard);
        this.form.controls.profession.setValue(val.profession);
        this.form.controls.extraProfession.setValue(val.extraProfession);
        this.form.controls.birthday.setValue(this.datePipe.transform(val.birthday, 'yyyy-MM-dd'));
        this.form.controls.education.setValue(val.education);
        this.form.controls.career.setValue(val.career);
        this.form.controls.remark.setValue(val.remark);
        this.form.controls.signature.setValue(val.signature);
        this.entityType = val.entityType;
       /*  this.province = val.province;
        this.city = val.city;
        this.college = val.college;
 */
        this.schools[0] = val.province;
        this.province = this.schools[0];
        this.schools[1] = val.city;
        this.city = this.schools[1];
        this.schools[2] = val.college;
        this.college = this.schools[2];
      }

    });
  }

  loadHeadImg() {
    const entityId = this.tokenService.get().entity_id;
    const param = {
      'businessId.equals': entityId
    };
    this.accountService.getImg(param).subscribe(res => {
      const val = res.body;
      if (val && val !== null && val.length > 0) {
        val.forEach(ele => {
          if (ele.businessType === '0') {
            this.headImgBase64 = ele.lobData;
          }
        });
      }
    });
  }


  beforeUpload = (file: UploadFile): boolean => {
    const imgFormat = ['jpg', 'png', 'jpeg', 'bmp', 'ico'];
    const type = file.name.substring(file.name.indexOf('.') + 1 ).toLowerCase();
    if (imgFormat.indexOf(type) < 0) {
       this.msg.error('格式错误,仅支持' + imgFormat + '格式');
       return false;
     }

     if (file.size > 100 * 1024) {
      this.msg.error('支持100KB以下图片上传');
      return false;
     }
    return true;
  }




  get sex() {
    return this.form.controls.sex;
  }
  get birthday() {
    return this.form.controls.birthday;
  }

  get name() {
    return this.form.controls.name;
  }
  get userAccount() {
    return this.form.controls.userAccount;
  }

  get idCard() {
    return this.form.controls.idCard;
  }

  get certificateCode() {
    return this.form.controls.certificateCode;
  }


  // 省市院校回调
  selectFinish(obj: any) {
    if (!obj.province || obj.province.id === null || obj.city.id === null || obj.college.id === null) {
      return;
    }
    this.province = obj.province.name;
    this.city = obj.city.name;
    this.college = obj.college.name;
  }
  submit() {
    const param = {};
    // tslint:disable-next-line: forin
    for (const key in this.form.controls) {
      this.form.controls[ key ].markAsDirty();
      this.form.controls[ key ].updateValueAndValidity();
      param[key] =  this.form.controls[key].value;
    }
    param['province'] = this.province;
    param['city'] = this.city;
    param['college'] = this.college;
    this.accountService.updateStudentInfo(param).subscribe(res => {
      const record = res.body;
      if (record && record.success === true) {
       this.msg.info('修改成功');
       this.loadData();
      } else {
        this.msg.error(record.message);
      }
    });
  }

   // 上传成功后把旧文件删除
   handleUploadChange(item: any) {
    if (item.type === 'success') {
      const res = item.file.response.data;
      if (res.businessType === '0') {
        this.headImgBase64 = res.lobData;
      }
      this.msg.remove();
      this.msg.info('修改成功');
      this.adminComponent.getHeadImg();
    }
 }
}
