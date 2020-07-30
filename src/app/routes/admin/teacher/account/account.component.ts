import { Component, OnInit, Inject } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { AccountService } from './account.service';
import {  DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-teacher-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  form: FormGroup;
  headImgList: UploadFile[] = [];
  headImgBase64 = '';
  teacherImgBase64 = '';
  headFileParam = {
    type: '0'
  };
  teacherFileParam = {
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

  schools = [];

  // 账号设置
  verifyState = 2;

  isBind = true;

  isLoading = false;

  constructor(
    fb: FormBuilder,
    public msg: NzMessageService,
    private sanitizer: DomSanitizer,
    private httpAddressService: HttpAddressService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private accountService: AccountService,
    private titleService: Title,
    private datePipe: DatePipe,
  ) {
    this.form = fb.group({
    userAccount : [null, [Validators.required]],
    sex : [null, [Validators.required]],
    name : [null, [Validators.required]],
    idCard: [null, [Validators.required]],
    certificateCode: [null, []],
    signature: [null, []],
    teacherProfession: [null, [Validators.required]],
    profession: [null, [Validators.required]],
    birthday: [null, [Validators.required]],
    subjectResult: [null, []],
    honor: [null]
  });
  // this.schools[0] = tokenService.get().entity_province;
  // this.province = this.schools[0];
  // this.schools[1] = tokenService.get().entity_city;
  // this.city = this.schools[1];
  // this.schools[2] = tokenService.get().entity_college;
  // this.college = this.schools[2];
  this.uploadAddress = httpAddressService.EduServe + '/edu-users/headImg/upload';
}

  ngOnInit() {
    this.titleService.setTitle('个人中心');
    this.loadData();
    this.loadHeadImg();
  }

  loadData() {
    this.msg.remove();
    this.msg.loading('加载中');
    const userId = this.tokenService.get().account_id;
    this.accountService.getTeacherData(userId).subscribe(res => {
    const record = res.body;
    this.msg.remove();
    if (record.success &&  record.success === true) {
        const val = record.data[0];
        this.form.controls.userAccount.setValue(val.userAccount);
        this.form.controls.sex.setValue(val.sex);
        this.form.controls.name.setValue(val.name);
        this.form.controls.idCard.setValue(val.idCard);
        this.form.controls.certificateCode.setValue(val.certificateCode);
        this.form.controls.teacherProfession.setValue(val.profession);
        this.form.controls.profession.setValue(val.profession);
        this.form.controls.birthday.setValue(this.datePipe.transform(val.birthday, 'yyyy-MM-dd'));
        this.form.controls.subjectResult.setValue(val.subjectResult);
        this.form.controls.honor.setValue(val.honor);
        this.form.controls.signature.setValue(val.signature);
        this.schools[0] = val.province;
        this.province = this.schools[0];
        this.schools[1] = val.city;
        this.city = this.schools[1];
        this.schools[2] = val.college;
        this.college = this.schools[2];
        // this.province = val.province;
        // this.city = val.city;
        // this.college = val.college;
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
          if (ele.businessType === '1') {
            this.teacherImgBase64 = ele.lobData;
          }
        });
      }
    });
  }


  beforeUpload = (file: UploadFile): boolean => {
    const imgFormat = ['jpg', 'png', 'jpeg', 'bmp', 'ico'];
    const type = file.name.substring(file.name.indexOf('.') + 1 ).toLowerCase();
    if (imgFormat.indexOf(type) < 0) {
       this.msg.remove();
       this.msg.error('格式错误,仅支持' + imgFormat + '格式');
       return false;
     }

     if (file.size > 100 * 1024) {
      this.msg.remove();
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

  get teacherProfession() {
    return this.form.controls.teacherProfession;
  }

  get profession() {
    return this.form.controls.teacherProfession;
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
    this.isLoading = true;
    this.accountService.updateTeacherData(param).subscribe(res => {
      const record = res.body;
      if (record && record.success === true) {
       this.msg.remove();
       this.msg.info('修改成功');
       this.loadData();
       this.isLoading = false;
      } else {
        this.msg.remove();
        this.msg.error(record.message);
        this.isLoading = false;
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
      if (res.businessType === '1') {
        this.teacherImgBase64 = res.lobData;
      }
      this.msg.remove();
      this.msg.info('修改成功');
    }
 }
}
