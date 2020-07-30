import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../../user.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.less']
})
export class StudentCourseComponent implements OnInit {
  studentId = '';
   // 图片前缀
   imgPrefix = '';
  // 全部
  currentPageIndex_all = 1;
  public page_all = 0;
  public size_all = 9;
  public total_all: number;
  dataList_all: any[] = [];
  queryParams_all = {
    // sort固定
    // sort: ['created_date,desc']
  };

  // 进行中
  currentPageIndex_underway = 1;
  public page_underway = 0;
  public size_underway = 9;
  public total_underway: number;
  dataList_underway: any[] = [];
  queryParams_underway = {
    // sort固定
     sort: ['ec.created_date,desc']
  };
  // 已完成
  currentPageIndex_finish = 1;
  public page_finish = 0;
  public size_finish = 9;
  public total_finish: number;
  dataList_finish: any[] = [];
  queryParams_finish = {
    // sort固定
     sort: ['created_date,desc']
  };

  constructor(
    private router: Router,
    public userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    httpAddressService: HttpAddressService
    ) {
      this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
      this.studentId = this.tokenService.get().entity_id;
    }

  ngOnInit() {
    this.getDataList_all();
    this.getDataList_underway();
    this.getDataList_finish();
  }

  nextPage() {
    this.router.navigateByUrl('/admin/teacher/my-course/class');
  }

 /**
  * 获取全部数据列表
  * @param {string} url
  */
 public getDataList_all(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams_all;
  if (isReset === true) {
    this.page_all = 0;
    Object.keys(q).forEach(function (key) {
      q[key] = '';
    });
  } else {
    Object.keys(q).forEach(function (key) {
      if (q[key] !== '' &&　q[key] !== null) {
        copyParams[key] = q[key];
      }
    });
  }
  copyParams['page'] = this.page_all;
  copyParams['size'] = this.size_all;
 this.userService.queryCourse(this.studentId, '', '', copyParams)
    .subscribe((res: any) => {
    this.dataList_all = res.body.data;
   this.total_all = res.headers.get('X-Total-Count');
    });
}

/**
  * 获取进行中数据列表
  * @param {string} url
  */
 public getDataList_underway(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams_underway;
  if (isReset === true) {
    this.page_all = 0;
    Object.keys(q).forEach(function (key) {
      q[key] = '';
    });
  } else {
    Object.keys(q).forEach(function (key) {
      if (q[key] !== '' &&　q[key] !== null) {
        copyParams[key] = q[key];
      }
    });
  }
  copyParams['page'] = this.page_underway;
  copyParams['size'] = this.size_underway;
 this.userService.queryCourse(this.studentId, '1', '', copyParams)
    .subscribe((res: any) => {
    this.dataList_underway = res.body.data;
    this.total_underway = res.headers.get('X-Total-Count');
    });
}

/**
  * 获取已经完成数据列表
  * @param {string} url
  */
 public getDataList_finish(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams_finish;
  if (isReset === true) {
    this.page_all = 0;
    Object.keys(q).forEach(function (key) {
      q[key] = '';
    });
  } else {
    Object.keys(q).forEach(function (key) {
      if (q[key] !== '' &&　q[key] !== null) {
        copyParams[key] = q[key];
      }
    });
  }
  copyParams['page'] = this.page_finish;
  copyParams['size'] = this.size_finish;
 this.userService.queryCourse(this.studentId, '3', '', copyParams)
    .subscribe((res: any) => {
    this.dataList_finish = res.body.data;
    this.total_finish = res.headers.get('X-Total-Count');
    });
}




}
