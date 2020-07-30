import { Component, OnInit, Inject } from '@angular/core';
import { CertificationService } from './certification.service';
import { HttpAddressService } from '@shared/session/http-address.service';
import { ModalHelper } from '@delon/theme';
import { EnlistComponent } from './enlist/enlist.component';
import { Certification } from './certification.model';
import { UserLoginComponent } from '../passport/login/login.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.less']
})
export class CertificationComponent implements OnInit {

  // 数据集合
  dataList = [];
  // 图片前缀
  imgPrefix = '';
  // 当前用户实体id
  entityId = '';
 // 当前用户id
  userId = '';

  thsBimList = [
    { name: '职业能力证书（封面）', src: '/assets/images/certificate_cover.png' },
    { name: '职业能力证书（内页）', src: '/assets/images/certificate_inner.png' }
  ];

  atcList = [
    { name: '欧特克ATC（Revit）认证', src: '/assets/images/certification/ATC1.png' },
    { name: '欧特克ATC（CAD）认证）', src: '/assets/images/certification/ATC2.png' },
    { name: 'Autodesk授权培训中心', src: '/assets/images/certification/ATC3.png' },
    { name: '2017获奖”最佳BIM教育实践奖“）', src: '/assets/images/certification/ATC4.png' },
    { name: '2018  Autodesk  ATC  优秀机构', src: '/assets/images/certification/ATC5.png' },
    { name: '2016获奖”十佳ATC“', src: '/assets/images/certification/ATC6.png' }
  ];

  // 是否登录
  isLogin = false;

  constructor(
    private certificationService: CertificationService,
    private modalHelper: ModalHelper,
    private httpAddressService: HttpAddressService,
    private modalService: NzModalService,
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
  }

  ngOnInit() {
    this.getUserData();
    this.loadData();
  }

  // 获取用户信息
  getUserData() {
    const token = this.tokenService.get().token;
    this.userId = this.tokenService.get().user_id;
    this.entityId = this.tokenService.get().entity_id;
    if (token && token !== null && token !== '') {
      this.isLogin = true;
    }
  }

  loadData() {
    const param = {
      'isOk.equals': '1',
      'sort': ['orderNum,asc']
    };
    this.certificationService.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.dataList = reconds;
        this.dataList.forEach(val => {
          if (val.linkUrl !== null && val.linkUrl !== '') {
            val.linkUrl = 'http://' + val.linkUrl;
          }
        });
      }
    });
  }

  openRegister(item: Certification) {
    if (this.isLogin !== true) {
        this.loginUser();
       return;
    }
    let type = '';
    let title = '';
    if (item.title === 'THS-BIM认证') {
      type = '1';
      title = 'THS-BIM认证报名';
    }

    if (item.title === 'Atudesk认证') {
      type = '2';
      title = 'Autodesk认证报名';
    }

    this.modalHelper.static( EnlistComponent,
      { type: type, eduCertChannelId: item.id}, 817,
      { nzTitle: title }).subscribe(() => {
      });
  }

  /**
   * 登陆
   */

  loginUser() {
    this.modalService.confirm({
      nzTitle: '请登录后操作',
      nzContent: '',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.modalHelper.static(UserLoginComponent, 600).subscribe((data: any) => {
          if (data) {
            this.msg.info('登陆成功');
            this.isLogin = true;
            this.ngOnInit();
          }
        });
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }

}
