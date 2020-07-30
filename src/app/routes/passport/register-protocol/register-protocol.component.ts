import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RegisterProtocolService } from './register-protocol.service';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-register-protocol',
  templateUrl: './register-protocol.component.html',
  styleUrls: ['./register-protocol.component.less']
})
export class RegisterProtocolComponent implements OnInit {

  recond = '';

  constructor(
    private location: Location,
    private modal: NzModalRef,
    private registerProtocolService: RegisterProtocolService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const param = {
      'isOk.equals' : '1',
      'type.equals' : '0'
    };
    this.registerProtocolService.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.recond = reconds[0].content;
      }
    });

  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterContentInit(): void {
    // 此页面隐藏banner和footer
    $('.banner').hide();
    $('.ant-layout-footer').hide();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    $('.banner').show();
    $('.ant-layout-footer').show();
  }

  goback() {
    this.modal.destroy();
  //  this.location.back();
  }

}
