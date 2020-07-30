import { Component, OnInit , Inject } from '@angular/core';
import { UserService } from '../../../user.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-my-course-hmemview',
  templateUrl: './hmemview.component.html',
  styleUrls: ['./hmemview.component.less']
})
export class HmAndEmViewDetailComponent implements OnInit {
 // 图片前缀
 imgPrefix = '';
 studentId = '';
 courseId = '';
 courseTypeId = '';
 classifyId = '';
 courseName = '';
 teacher = '';
 fileid = '';
 tid = '';

 // 全部
 currentPageIndex = 1;
 public page = 1;
 public size = 10;
 public total: number;
 dataList: any[] = [];

 public coursePage = 1;
 public courseSize = 10;
 public courseTotal: number;
 courseDataList: any[] = [];

 queryParams = {
   // sort固定
   // sort: ['created_date,desc']
 };
  constructor(
    private router: Router,
    httpAddressService: HttpAddressService,
    public userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private routeInfo: ActivatedRoute
  ) {
    this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
   // this.studentId = this.tokenService.get().entity_id;
    this.courseId = this.routeInfo.snapshot.queryParams['courseId'];
    this.studentId = this.routeInfo.snapshot.queryParams['studentId'];
    this.courseTypeId = this.routeInfo.snapshot.queryParams['courseTypeId'];
    this.classifyId = this.routeInfo.snapshot.queryParams['classifyId'];
   }


  ngOnInit() {
   this.getDataList();
  this.getHmResultDataList();
  }

/**
  * 获取课程考试结果数据列表
  * @param {string} url
  */
 public getDataList() {
  const copyParams = {};
   copyParams['page'] = this.coursePage - 1;
  copyParams['size'] = this.courseSize;
  copyParams['eduCourseId.equals'] = this.courseId;
  copyParams['studentId.equals'] = this.studentId;
  copyParams['sort'] = 'createdDate,desc';
  this.userService.queryCourseResult( copyParams)
    .subscribe((res: any) => {
      console.log(res);
    this.courseDataList = res.body;
   this.courseTotal = res.headers.get('X-Total-Count');
  });
}

/**
  * 获取作业结果数据列表
  * @param {string} url
  */
 public getHmResultDataList() {
  const copyParams = {};
  copyParams['page'] = this.page - 1;
  copyParams['size'] = this.size;
  copyParams['courseId'] = this.courseId;
  copyParams['studentId'] = this.studentId;
  this.userService.queryHomeResult( copyParams)
    .subscribe((res: any) => {
    this.dataList = res.body.data;
     this.total = res.headers.get('X-Total-Count');
  });
}




 /**
  * 页码变动事件
  * @param
  */
 pageIndexChange() {
   this.getHmResultDataList();
}


 /**
  * 页码变动事件
  * @param
  */
 coursePageIndexChange() {
  this.getDataList();
}

backPage() {
  this.router.navigateByUrl('/admin/teacher/my-course/class?id=' + this.courseId + '&courseTypeId=' + this.courseTypeId
  + '&classifyId=' + this.classifyId );
}


continueStudy() {
  this.router.navigateByUrl('/course/detail?courseId=' + this.courseId);
 }



// add by xq 2020-06-10
learn() {
  const uri = '/course/learn?courseId=' +  this.courseId + '&teacherUserId=' + this.tid;
  this.router.navigateByUrl(uri);
}


}
