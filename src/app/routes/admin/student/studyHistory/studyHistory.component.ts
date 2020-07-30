import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { StudyHistoryService } from './studyHistory.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
@Component({
  selector: 'app-study-history',
  templateUrl: './studyHistory.component.html',
  styleUrls: ['./studyHistory.component.less']
})
export class StudyHistoryComponent implements OnInit {
  studentId='';
  // 图片前缀
  imgPrefix = '';
  //全部
  currentPageIndex = 1;
  public page = 0;
  public size= 9;
  public total: number;
  dataList: any[] = [];
  queryParams = {
    // sort固定
    // sort: ['created_date,desc']
  };

  
  
 
  constructor(
    private router: Router,
    public studyHistoryService: StudyHistoryService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    httpAddressService: HttpAddressService
    ) {
      this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
      this.studentId = this.tokenService.get().entity_id;

    }

  ngOnInit() {
    this.getDataList();
  }

  nextPage() {
    this.router.navigateByUrl('/admin/teacher/my-course/class');
  }

 /**
  * 获取全部数据列表
  * @param {string} url
  */
 public getDataList(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams;
  if (isReset === true) {
    this.page = 0;
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
  copyParams['page'] = this.page;
  copyParams['size'] = this.size;
  
 this.studyHistoryService.queryStudentHistory(this.studentId, copyParams)
    .subscribe((res: any) => {
    this.dataList = res.body.data;
   this.total = res.headers.get('X-Total-Count');
  
    });
}



}
