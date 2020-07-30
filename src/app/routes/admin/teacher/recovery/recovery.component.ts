import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { CourseService } from 'app/routes/course/course.service';
import { TokenService, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpAddressService } from '@shared/session/http-address.service';
import { QuestionBankService } from '../question-bank/question-bank.service';
@Component({
  selector: 'app-teacher-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.less']
})
export class RecoveryComponent implements OnInit {
  baseImgUrl = '';
  defaultImg =  '/assets/images/course-cover-img.png';
  imgPrefix = '';
  featureCourseList = [];
  // 题目list
  subjectList = [];
  // 显示模态框
  isVisible = false;
  loading = true;
  // 当前分页
  page = 1;
  // 分页大小
  size = 6;
  // 数据总数
  total = '';
  teacherId = '';
  tmpCourseId = '';
  tmpStatus = '';
  title = '恢复课程';
  constructor(
    private router: Router,
    private courseService: CourseService,
    private questionBankService: QuestionBankService,
    public msg: NzMessageService,
    httpAddressService: HttpAddressService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
      this.teacherId = tokenService.get().entity_id;
      this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
    }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadCourse();
    // this.loadSubject();
  }



  loadSubject() {
    this.questionBankService.findRecoverySubject().subscribe(res => {
      const reconds = res.body;
      this.subjectList = reconds;
    });
  }



  loadCourse() {
    const queryParam = {
      'isDelete.equals': '2',
      'teacherId.equals': this.teacherId,
      'page': this.page - 1,
      'size': this.size,
      'sort': ['orderNum,asc']
    };
    this.msg.loading('加载中');
    this.courseService.queryCourse(queryParam).subscribe(res => {
      const records = res.body;
      if (records && records.length > 0) {
        records.forEach(record => {
          if (record.remark === null || record.remark === '') {
              record.courseCoverUrl = this.defaultImg;
          } else {
            record.courseCoverUrl = this.imgPrefix + record.remark;
          }
        });
        this.total = res.headers.get('X-Total-Count');
        this.msg.remove();
      }
      this.featureCourseList = records;
    });
  }

  // 删除或者恢复
  updateIsDelete() {
    const courseId = this.tmpCourseId;
    const status = this.tmpStatus;
    if (status === '1' || status === '0') {
      this.courseService.updateIsDelete(courseId, status).subscribe(res => {
        this.handleCancel();
        if (res.success && res.success === true) {
          this.msg.info(res.msg);
          this.loadData();
        } else {
          this.msg.error('操作失败');
        }
      });
    } else {
      this.msg.error('参数错误');
    }

  }

  nextPage() {
    this.loadData();
  }

  showModal(courseId, status): void {
    if (status === '0') {
      this.title = '恢复课程';
    } else if (status === '1') {
      this.title = '删除课程';
    }
    this.isVisible = true;
    this.tmpCourseId = courseId;
    this.tmpStatus = status;
  }

  handleOk(): void {
    this.updateIsDelete();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
