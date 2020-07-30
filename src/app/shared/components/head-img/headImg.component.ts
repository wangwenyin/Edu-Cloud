/**
 * 省市院校三级联动组件
 * @author xq
 * @since 2020-03-03
 * @description 省市院校三级联动组件
 */
// tslint:disable:no-any
import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { DomSanitizer } from '@angular/platform-browser';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ths-head-img',
  templateUrl: './headImg.component.html',
  styles: []
})

export class ThsHeadImgComponent implements OnInit {

    /**
     * 头像base64
     */
    @Input() value = '';

    /**
     * 性别  1 为 男 2 为 女
     */
    @Input() sex = '1';

    /**
     * 角色类型  1 为老师 ，其他为学生
     */
    @Input() type = '0';

    /**
     * 显示尺寸大小，默认60
     */
    @Input() size = 60;

    /**
     * margin- top
     */
    @Input() top = 0;

    /**
     *margin-right
     */
    @Input() right = 15;

    /**
     *是否使用token中的参数,只能用于用户自己的头像
     */
    @Input() useToken = false;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
) {}

  ngOnInit() {
  }


  getStyle() {
    return { 'height': this.size + 'px', 'width': this.size + 'px', 'margin-top': this.top + 'px', 'margin-right': this.right + 'px' };
  }

  getDefaultImgSrc() {
    if (this.useToken === true) {
      this.type =  this.tokenService.get().entity_type;
      this.sex =  this.tokenService.get().user_sex;
    }

    if (this.type === '0') {
      if (this.sex === '1') {
        return '/assets/images/headimg/student-man.png';
      } else {
        return '/assets/images/headimg/student-woman.png';
      }
    } else {
      if (this.sex === '1') {
        return '/assets/images/headimg/teacher-man.png';
      } else {
        return '/assets/images/headimg/teacher-woman.png';
      }
    }
  }
}
