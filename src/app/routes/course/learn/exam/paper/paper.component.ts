import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { ModalHelper } from '@delon/theme';
import { LearnExamService } from '../exam.service';
import { ExamResultService } from '../result.service';
import { ExamDetailsService } from '../details.service';

/**
 * 考试试卷 -- 作答页面
 */
@Component({
  selector: 'app-learn-exam-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.less']
})

export class ExamPaperComponent implements OnInit {

  @Input() examId = '';

  /**
  * 提交考试回调
  */
  @Output() submitFinish: EventEmitter<{}> = new EventEmitter<{}>();

  // 打开页面操作 2-中断后进入  1- 第一次进入  3-完成后进入
  code = '3';

  // 是否能操作
  disabled = false;
  // 是否中断后进入
  isInterruptOpen = false;
  // 中断后从后台带回来的答案list
  interruptAnswerList = [];
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
    // private cacheService: CacheService,
    private learnExamService: LearnExamService,
    private examResultService: ExamResultService,
    private examDetailsService: ExamDetailsService,
  ) {
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
    this.learnExamService.queryExam(this.examId).subscribe(res => {
      this.code = '2';
      this.msg.remove();
      if (res && res.body) {
        this.code = res.body.message ;
        if (this.code === '2') {
          this.isInterruptOpen = true;
          if (res.body.data.remark) {
            this.interruptAnswerList = JSON.parse(res.body.data.remark);
          }
          console.log(this.interruptAnswerList);
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
    if (this.code !== '3') {
      this.countDown();
    }
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
    console.log(this.multipleList);
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
      this.multipleAnswer[i - radioLength][0].answer = answerArr[i].split('#').join('.');;
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
    // const radioAnswer = this.cacheService.getNone<any>('exam_radioAnswer');
    // const judgmentAnswer = this.cacheService.getNone<any>('exam_judgmentAnswer');
    // const multipleAnswer = this.cacheService.getNone<any>('exam_multipleAnswer');

    if (this.isInterruptOpen === true && this.code !== '3') {
      // 单选赋值
      this.radioList.forEach(e => {
        const tmp = {
          id: e.id
        };
        this.interruptAnswerList.forEach(pageAnswer => {
          if (tmp.id === pageAnswer.id) {
            tmp['answer'] =  pageAnswer.answer;
          }
        });
        this.radioAnswer.push(tmp);
      });

      // 判断赋值
      this.judgmentList.forEach(e => {
        const tmp = {
          id: e.id
        };
        this.interruptAnswerList.forEach(pageAnswer => {
          if (tmp.id === pageAnswer.id) {
            tmp['answer'] =  pageAnswer.answer;
          }
        });
        this.judgmentAnswer.push(tmp);
      });
      // 多选赋值
      this.multipleAnswer.forEach(e0 => {
          this.interruptAnswerList.forEach(pageAnswer => {
            if (e0[0].id === pageAnswer.id) {
              const amswers = pageAnswer.answer.split('#');
              if (amswers && amswers.length > 0) {
                amswers.forEach(e2 => {
                    e0.forEach(e1 => {
                    if (e2 === e1.value) {
                     e1.checked = true;
                    }
                  });
                });
              }
            }
          });
      });



    } else {
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
    }


    // if (this.isInterruptOpen === true && this.code !== '3') {
    //   if (null !== radioAnswer) {
    //     this.radioAnswer = radioAnswer;
    //   }
    //   if (null !== judgmentAnswer) {
    //     this.judgmentAnswer = judgmentAnswer;
    //   }
    //   if (null !== multipleAnswer) {
    //     this.multipleAnswer = multipleAnswer;
    //   }
    // }

    if (this.code === '3') {
      // 初始化用户答案
      this.initPageAnswer();
      return;
    }
  }

  // 选中后提交
  submit() {
    this.modalService.confirm({
      nzTitle: '提交后本次作业的答案将不可修改，确定要提交?',
      nzContent: '',
      nzOkText: '是',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.doSubmit();
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  doSubmit() {
    const pageAnswer = this.radioAnswer.concat(this.multipleAnswerToParam()).concat(this.judgmentAnswer);
    const param = {
      id : this.examDetailsId,
      eduExamResultId: this.examResultId,
      answerList: pageAnswer
    };
    this.examResultService.submitExam(param).subscribe(res => {
      if (res && res.body) {
        const code = res.body.code ;
        if (code !== '1') {
          this.msg.error(res.body.message);
        } else {
          this.msg.success('提交成功，正在计算成绩请稍后');
          const recond = res.body.data;
          this.submitFinish.emit(recond);
          this.radioAnswer = [];
          this.multipleAnswer = [];
          this.judgmentAnswer = [];
          this.radioList = [];
          this.multipleList = [];
          this.judgmentList = [];
          this.getExam();
        }
      }
    });
  }

  updatePageAnswer() {
    const pageAnswer = this.radioAnswer.concat(this.multipleAnswerToParam()).concat(this.judgmentAnswer);
    const param = {
      id : this.examDetailsId,
      eduExamResultId: this.examResultId,
      answerList: pageAnswer
    };
    this.examDetailsService.updateEduStudyHmResult(param).subscribe(res => {

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

  // 考试倒计时  -- 每秒向本地缓存一次，中断时可拿回答案内容
  countDown() {
    this.timer = setInterval(() => {
      this.TEST_TIME--;
      if (this.TEST_TIME < 0) {
        this.disabled = true;
        this.TEST_TIME = 0;
        clearInterval(this.timer);
        this.msg.info('系统正在尝试为您自动提交考试，刷新页面可查看考试结果');
        // setTimeout(() => {
        //   this.zone.run(() => {
        //     // 要更新视图的代码
        //    });
        //   // this.getExam();
        // }, 15000);
      }

      const h = Math.floor(this.TEST_TIME / (60 * 60));
      const H = h * 60 * 60;
      const M = this.TEST_TIME - H;
      const m = Math.floor(M / 60);
      const s = M - m * 60;
      this.test_time = `0${h}:${String(m).length > 1 ? m : '0' + m }:${String(s).length > 1 ? s : '0' + s }`;
      // this.cacheService.set('exam_radioAnswer', this.radioAnswer);
      // this.cacheService.set('exam_judgmentAnswer', this.judgmentAnswer);
      // this.cacheService.set('exam_multipleAnswer', this.multipleAnswer);
    }, 1000);
  }
}
