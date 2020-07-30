import { Component, OnInit , Inject, Output , EventEmitter } from '@angular/core';
import { UserService } from '../../../user.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { LearnHomeworkService } from '../../../../course/learn/homework/homework.service';
import { CacheService } from '@delon/cache';
import { HomeworkResultService } from '../../../../course/learn/homework/result.service';
import { HomeworkDetailsService } from '../../../../course/learn/homework/details.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-learn-homeworkDetail',
  templateUrl: './homeworkDetail.component.html',
  styleUrls: ['../../../../course/learn/homework/paper/paper.component.less']
})
export class HomeworkDetailComponent implements OnInit {
  courseId = '';
  courseName = '';
  teacher = '' ;
  fileid = '';
  tid = '' ;
  studentId = '';
  courseTypeId = '';
  classifyId = '';


// 打开页面操作 2-中断后进入  1- 第一次进入  3-完成后进入
code = '3';
  /**
  * 提交作业回调
  */
 @Output() submitFinish: EventEmitter<{}> = new EventEmitter<{}>();

// 是否能操作
disabled = false;
// 是否中断后进入
isInterruptOpen = false;

homeworkId  = '';
// 作答详情id
homeworkDetailsId  = '';
// 作答结果id
homeworkResultId = '';
// 单选答案
radioAnswer = [];
// 多选答案
multipleAnswer = [];
// 判断答案
judgmentAnswer = [];
// 作业全部数据
homework: any;
// typelist
dataList = [];
// 单选题
radioList = [];
// 多选题
multipleList = [];
// 判断题
judgmentList = [];
// 定时器
timer = null;
// 答案解析默认折叠
isExpand = false;
 queryParams = {
   // sort固定
   // sort: ['created_date,desc']
 };
  constructor(
    private router: Router,
    public msg: NzMessageService,
    httpAddressService: HttpAddressService,
    public userService: UserService,
    private cacheService: CacheService,
    private modalService: NzModalService,
    private homeworkResultService: HomeworkResultService,
    public learnHomeworkService: LearnHomeworkService,
    private homeworkDetailsService: HomeworkDetailsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private routeInfo: ActivatedRoute
  ) {
    this.studentId = this.routeInfo.snapshot.queryParams['studentId'];
    if ( null == this.studentId || '' === this.studentId) {
    this.studentId = this.tokenService.get().entity_id;
      }
    this.homeworkId = this.routeInfo.snapshot.queryParams['homeworkId'];
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
  this.getHomework();
}

// 切换显示答案解析
showmore(e) {
  $(e.currentTarget).closest('.answer-box').siblings('.parse-box').slideToggle('fast');
  this.isExpand = !this.isExpand;
}

// 获取题目
getHomework() {
  this.learnHomeworkService.queryHomeworkToView(this.homeworkId, this.studentId).subscribe(res => {
    this.code = '2';
    this.msg.remove();
    console.log(res);
    if (res && res.body) {
      this.code = res.body.message ;
      if (this.code === '2') {
        this.isInterruptOpen = true;
      }
      if (this.code === '3') {
        this.disabled = true;
      }
      const recond = res.body.data;
      this.homework = recond;
      this.dataList = recond.eduHomeworkTypeDTOList;
      this.homeworkDetailsId = recond.createdBy;
      this.homeworkResultId = recond.lastModifiedBy;
      this.groupDataList();
    }
  });
}

// 分组题目
groupDataList() {
  if (this.dataList && this.dataList.length > 0) {
    this.dataList.forEach(v => {
      if (v.eduHomeworkTopicDTOList && v.eduHomeworkTopicDTOList.length > 0) {
        if (v.subjectType === '0') {
          this.radioList = this.radioList.concat(v.eduHomeworkTopicDTOList);
         }
        if (v.subjectType === '1') {
           this.multipleList = this.multipleList.concat(v.eduHomeworkTopicDTOList);
          }
        if (v.subjectType === '2') {
          this.judgmentList = this.judgmentList.concat(v.eduHomeworkTopicDTOList);
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

// 已经完成作业时 对答题卡进行初始化
initPageAnswer() {
  const answer = this.homework.remark;
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

  const radioAnswer = this.cacheService.getNone<any>('homework_radioAnswer');
  const judgmentAnswer = this.cacheService.getNone<any>('homework_judgmentAnswer');
  const multipleAnswer = this.cacheService.getNone<any>('homework_multipleAnswer');

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




updatePageAnswer() {
  const pageAnswer = this.radioAnswer.concat(this.multipleAnswerToParam()).concat(this.judgmentAnswer);
  const param = {
    id : this.homeworkDetailsId,
    eduStudyHmResultId: this.homeworkResultId,
    answerList: pageAnswer
  };
  this.homeworkDetailsService.updateEduStudyHmResult(param).subscribe(res => {
    // if (res && res.body) {
    //   const code = res.body.code ;
    //   if (code !== '1') {
    //     this.msg.error(res.body.message);
    //   } else {
    //     this.msg.success('提交成功，正在计算成绩请稍后');
    //     const recond = res.body.data;
    //     this.submitFinish.emit(recond);
    //     this.radioAnswer = [];
    //     this. multipleAnswer = [];
    //     this.judgmentAnswer = [];
    //     this.radioList = [];
    //     this.multipleList = [];
    //     this. judgmentList = [];
    //     this.getHomework();
    //   }
    // }
  });
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
    + '&courseTypeId=' + this.courseTypeId + ' &classifyId=' + this.classifyId);
  }
}

}
