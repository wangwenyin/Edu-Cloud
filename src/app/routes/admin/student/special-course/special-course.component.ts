import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../../user.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
import { SpecialCourseService } from './special-course.service';
import { SpecialCourse } from './special-course.model';
@Component({
  selector: 'app-special-course',
  templateUrl: './special-course.component.html',
  styleUrls: ['./special-course.component.less']
})
export class SpecialCourseComponent implements OnInit {
  entityId = ''; // 用户id
  imgPrefix = ''; // 图片前缀

  dataList: SpecialCourse[] = [];

  page = 1;
  // 分页大小
  size = 8;
  total = '';

  constructor(
    private router: Router,
    private specialCourseService: SpecialCourseService,
    public userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    httpAddressService: HttpAddressService
    ) {
      this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
      this.entityId =  this.tokenService.get().entity_id;
    }

  ngOnInit() {
    this.getDataList();
  }

  nextPage() {
    this.getDataList();
  }

 /**
  * 获取专题课程列表
  * @param {string} url
  */
 public getDataList(isReset?: boolean) {
   const param = {
    'page': this.page - 1,
    'size': this.size,
    'sort': ['created_date,asc']
   };
   this.specialCourseService.querySpecialCourse(param).subscribe(res => {
     const reconds = res.body;
     this.total = res.headers.get('X-Total-Count');
     this.dataList = reconds;
   });
}

}
