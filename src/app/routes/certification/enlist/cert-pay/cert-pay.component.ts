import { Component, OnInit } from '@angular/core';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd';
import { CertPayService } from './cert-pay.service';

@Component({
  selector: 'app-cert-order',
  templateUrl: './cert-pay.component.html',
  styleUrls: ['./cert-pay.component.less']
})
export class  CertPayComponent implements OnInit {

  order: any;
  loading = false;
  // payType = 'wx';
  radioValue = '1';

  zfbPayUrl = '';
  wxQr = '';

  imgPrefix = '';

  isVisible = false;

  // 是否显示其它支付
  isShow = false;

  constructor(
   private router: Router,
   private modal: NzModalRef,
   private httpAddressService: HttpAddressService,
   private certPayService: CertPayService
  ) {
    this.imgPrefix =  this.httpAddressService.apiGateway + this.httpAddressService.systemServe + '/sys-files/download/';
   }

  ngOnInit() {
    this.initPayUrl();
  }

  initPayUrl() {
    this.zfbPayUrl = this.httpAddressService.apiGateway + this.httpAddressService.EduServe
    + '/edu-cert-regedist-pays/ali-pay/' + this.order.id;
    // this.wxPayUrl = this.httpAddressService.apiGateway +  this.httpAddressService.EduServe
    // + '/edu-course-pays/wx-pay/' + this.order.id;
  }


  toggleShow() {
    this.isShow = !this.isShow;
    $('#pay-mode-others').slideToggle('fast');
  }

  payNow() {
    if (this.radioValue === '1') {
      this.loading = true;
      this.certPayService.wxPay(this.order.id).subscribe(res => {
        const recond = res;
        if (recond && recond.success === true) {
           this.wxQr = this.formatQr(recond.data);
           console.log(this.wxQr);
        }
        this.loading = false;
        this.showModal();
      });

    }
  }


  formatQr(qd: string) {
    let tmp = qd.replace(/%2F/g, '/');
        tmp = tmp.replace(/%3D/g, '=');
        tmp = tmp.replace(/%3F/g, '?');
        tmp = tmp.replace(/%3A/g, ':');
     return tmp;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
      this.isVisible = false;
      this.modal.destroy();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  // 改变支付方式
  // changePayType(payType: string) {
  //   this.payType = payType;
  //   alert(payType);
  // }

}
