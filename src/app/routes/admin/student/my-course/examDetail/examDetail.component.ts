import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { ModalHelper } from '@delon/theme';
import { LearnExamService } from '../../../../course/learn/exam/exam.service';
import { ExamResultService } from '../../../../course/learn/exam/result.service';
import { ExamDetailsService } from '../../../../course/learn/exam/details.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
/**
 * 考试试卷 -- 作答页面
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-learn-examDetail',
  templateUrl: './examDetail.component.html',
  styleUrls: ['../../../../course/learn/exam/paper/paper.component.less']
})

export class ExamDetailComponent implements OnInit {

  @Input() examId = '';

  /**
  * 提交考试回调
  */
  @Output() submitFinish: EventEmitter<{}> = new EventEmitter<{}>();

  // 打开页面操作 2-中断后进入  1- 第一次进入  3-完成后进入
  studentId = '';
  code = '3';
  courseId = '';
  courseName = '';
  teacher = '' ;
  fileid = '';
  tid = '' ;
  courseTypeId = '';
  classifyId = '';
  // 是否能操作
  disabled = false;
  // 是否中断后进入
  isInterruptOpen = false;
  // 作答详情id
  examDetailsId  = '';
  // 作答结果id
  examResultId = '';
  // 单选答案
  radioAnswer = [];
  // 多选答案
  multipleAnswer = [];
  // 判断答案
  judgmentAnswer = [];
  // 考试全部数据
  exam: any;
  // typelist
  dataList = [];
  // 单选题
  radioList = [];
  // 多选题
  multipleList = [];
  // 判断题
  judgmentList = [];
  // 考试时间 s
  TEST_TIME = 2 * 60 * 60;
  // 剩余考试时间
  test_time  = '00:00:00';
  // 定时器
  timer = null;
  // 答案解析默认折叠
  isExpand = false;

  constructor(
    public msg: NzMessageService,
    private modalService: NzModalService,
    private modalHelper: ModalHelper,
    private cacheService: CacheService,
    private learnExamService: LearnExamService,
    private examResultService: ExamResultService,
    private examDetailsService: ExamDetailsService,
    private routeInfo: ActivatedRoute,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,

  ) {
    this.studentId = this.routeInfo.snapshot.queryParams['studentId'];
    if ( null == this.studentId || '' === this.studentId) {
    this.studentId = this.tokenService.get().entity_id;
      }
    this.examId = this.routeInfo.snapshot.queryParams['examId'];
    this.courseId = this.routeInfo.snapshot.queryParams['courseId'];
    this.courseName = this.routeInfo.snapshot.queryParams['courseName'];
    this.teacher = this.routeInfo.snapshot.queryParams['teacher'];
    this.fileid = this.routeInfo.snapshot.queryParams['fileid'];
    this.tid = this.routeInfo.snapshot.queryParams['tid'];
    this.courseTypeId = this.routeInfo.snapshot.queryParams['courseTypeId'];
    this.classifyId = this.routeInfo.snapshot.queryParams['classifyId'];
  }

  // 初始化页面
  ngOnInit() {
    this.getExam();
  }

  // 切换显示答案解析
  showmore(e) {
    $(e.currentTarget).closest('.answer-box').siblings('.parse-box').slideToggle('fast');
    this.isExpand = !this.isExpand;
  }


  // 获取题目
  getExam() {
    this.learnExamService.queryExamToView(this.examId, this.studentId).subscribe(res => {
      this.code = '2';
      this.msg.remove();
      if (res && res.body) {
        this.code = res.body.message ;
        if (this.code === '2') {
          this.isInterruptOpen = true;
        }
        if (this.code === '3') {
          this.disabled = true;
          res.body.data.eduExamId =  res.body.data.id;
          this.submitFinish.emit(res.body.data);
        }
        const recond = res.body.data;
        this.exam = recond;
        if (recond) {
          this.dataList = recond.eduExamTypeDTOList;
          this.TEST_TIME = recond.examTimeLength;
          if (this.code === '1') {
            this.TEST_TIME = this.TEST_TIME * 60;
          }
          this.examDetailsId = recond.createdBy;
          this.examResultId = recond.lastModifiedBy;
          this.groupDataList();
        }
      }
    });
  }

  // 分组题目
  groupDataList() {
    if (this.dataList && this.dataList.length > 0) {
      this.dataList.forEach(v => {
        if (v.eduExamTopicDTOList && v.eduExamTopicDTOList.length > 0) {
          if (v.subjectType === '0') {
            this.radioList = this.radioList.concat(v.eduExamTopicDTOList);
           }
          if (v.subjectType === '1') {
             this.multipleList = this.multipleList.concat(v.eduExamTopicDTOList);
            }
          if (v.subjectType === '2') {
            this.judgmentList = this.judgmentList.concat(v.eduExamTopicDTOList);
           }
        }
      });
    }
    this.cutRadioOptions();
    this.cutmultipleOptions();
    this.initAnswer();
 }

 // 切割选项
  cutRadioOptions() {
    this.radioList.forEach( e => {
      const allOption = [];
      const options = e.subjectOptions;
      options.split('#').forEach(ele => {
        const tmpOption = ele.split('.');
        const index = ele.indexOf('.');
        const tmp = {
          prefix : tmpOption[0],
          content: ele.slice(index + 1, ele.length)
        };
        allOption.push(tmp);
      });
      e.subjectOptions = allOption;
    });
  }

  cutmultipleOptions() {
    this.multipleList.forEach( e => {
      if (this.code === '3') {
        e.rightAnswer = e.rightAnswer.split('#').join('.');
      }
      const allOption = [];
      const options = e.subjectOptions;
      options.split('#').forEach(ele => {
        const tmpOption = ele.split('.');
        const tmp = {
          id : e.id,
          value : tmpOption[0],
          label: ele,
          checked: false
        };
        allOption.push(tmp);
      });
      this.multipleAnswer.push(allOption);
      e.subjectOptions = allOption;
    });
  }


  // 已经完成考试时 对答题卡进行初始化
  initPageAnswer() {
    const answer = this.exam.remark;
    const answerArr = answer.split(',');
    const radioLength = this.radioAnswer.length;
    const multipleLength = this.multipleAnswer.length;
    const rmLength = radioLength + multipleLength;
    const judgeLength = this.judgmentAnswer.length;

    for (let i = 0; i < radioLength; i ++ ) {
      this.radioAnswer[i].answer = answerArr[i];
    }
    for (let i = radioLength; i < rmLength; i ++ ) {
      this.multipleAnswer[i - radioLength][0].answer = answerArr[i].split('#').join('.');
      this.multipleAnswer[i - radioLength].forEach(e => {
        if (answerArr[i].indexOf(e.value) !== -1 ) {
            e.checked = true;
       }
      });

      // this.multipleAnswer[i - radioLength ][0].answer = answerArr[i];
    }
    for (let i = rmLength; i < rmLength + judgeLength; i ++ ) {
      this.judgmentAnswer[i - rmLength].answer = answerArr[i];
    }
  }


  // 初始化答题卡
  initAnswer() {
    this.radioList.forEach(e => {
      const tmp = {
        id: e.id,
        answer: '-'
      };
      this.radioAnswer.push(tmp);
    });
    this.judgmentList.forEach(e => {
      const tmp = {
        id: e.id,
        answer: '-'
      };
      this.judgmentAnswer.push(tmp);
    });

    const radioAnswer = this.cacheService.getNone<any>('exam_radioAnswer');
    const judgmentAnswer = this.cacheService.getNone<any>('exam_judgmentAnswer');
    const multipleAnswer = this.cacheService.getNone<any>('exam_multipleAnswer');

    if (this.isInterruptOpen === true && this.code !== '3') {
      if (null !== radioAnswer) {
        this.radioAnswer = radioAnswer;
      }
      if (null !== judgmentAnswer) {
        this.judgmentAnswer = judgmentAnswer;
      }
      if (null !== multipleAnswer) {
        this.multipleAnswer = multipleAnswer;
      }
    }

    if (this.code === '3') {
      // 初始化用户答案
      this.initPageAnswer();
      return;
    }
  }


  multipleAnswerToParam() {
    const param = [];
    this.multipleAnswer.forEach(ele => {
      const tmp = {
        id : ele[0].id,
        answer: ''
      };
      let answer = '';
      ele.forEach(element => {
        if (element.checked === true) {
          answer += '#' + element.value;
        }
      });
      tmp.answer = answer.substring(1);
      param.push(tmp);
    });
    return param;
  }


  backPage() {
    if (!!this.teacher) {
    this.router.navigateByUrl('/admin/student/my-course/detail?courseId=' + this.courseId + '&&courseName=' + this.courseName
    + '&teacher=' + this.teacher + ' &fileid=' + this.fileid + '&tid=' + this.tid);
   } else {
    this.router.navigateByUrl('/admin/teacher/hmandemview?courseId=' + this.courseId + '&studentId=' + this.studentId
   + '&courseTypeId=' + this.courseTypeId + '&classifyId=' + this.classifyId);
   }
  }

}
