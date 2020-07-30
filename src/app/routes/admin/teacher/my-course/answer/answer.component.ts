import { Component, OnInit, Inject, Input } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FileUploadService } from '@shared/components/fileUpload/fileUpload.service';
import { ReturnStatement } from '@angular/compiler';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { CatalogService } from '../edit/edit.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.less']
})
export class CourseAnswerComponent implements OnInit {

  courseHourList = [
    // tslint:disable-next-line: max-line-length
    // { name: 'CAD快捷键-绘图常用2', isEdit: true, video: { name: '微软数字商业课程可视化', size: 156, time: '2020-1-25' }, ppt: { name: '微软数字商业课程可视化', size: 156, time: '2020-1-25' }, doc: { name: '微软数字商业课程可视化', size: 156, time: '2020-1-25'} },
    // tslint:disable-next-line: max-line-length
    // { name: '平面家具的布置(Part01)', isEdit: false, video: { name: '微软数字商业课程可视化', size: 156, time: '2020-1-25' }, ppt: { name: '微软数字商业课程可视化', size: 156, time: '2020-1-25' } },
  ];

  @Input() courseId = '';
  courseFileList = [];
  isShowResource = false;
  isShowDetail = false;
  curIndex: number;
  curCourseHourId = '';
  catalogId = '';
  catalogName = '';

  uploadType = '-1';
  queryParams = {
     'sort': ['orderNum,asc'],
     'isOk.equals': '1'
  };
  constructor(
    private catalogService: CatalogService,
    public sanitizer: DomSanitizer,
    private msg: NzMessageService,
    private routerInfo: ActivatedRoute,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    if (this.courseId === '') {
      this.courseId = this.routerInfo.snapshot.queryParams['courseId'];
    }
  }

  ngOnInit() {
    this.loadData();
  }
  // 加载数据
  loadData() {
    this.queryParams['eduCourseId.equals'] = this.courseId;
    this.msg.loading('加载中');
    this.catalogService.queryCatalogAndMsgNum(this.courseId).subscribe(res => {
      const tmp = res.data;
      tmp.forEach(element => {
        if (element.createdDate && element.createdDate !== null) {
          element.createdDate = moment(element.createdDate).format('YYYY-MM-DD HH:mm:ss');
        }
      });
      this.msg.remove();
      if (tmp && tmp !== null && tmp.length > 0) {
         this.courseHourList = tmp;
      }
    });
}

openAnware() {
  this.isShowDetail = false;
}

selectCourseCatalog(item: any) {
  this.catalogId = item.id;
  this.catalogName = item.name;
  this.isShowDetail = true;
}


}
