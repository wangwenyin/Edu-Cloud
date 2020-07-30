import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { ModalHelper } from '@delon/theme';
import { LearnHomeworkService } from '../homework.service';
import { HomeworkResultService } from '../result.service';
import { HomeworkDetailsService } from '../details.service';

/**
 * 作业试卷 -- 作答页面
 */
@Component({
  selector: 'app-learn-homework-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.less']
})

export class HomweworkPaperComponent implements OnInit {

  @Input() homeworkId = '';

  /**
  * 提交作业回调
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
  // 作业时间 s
  TEST_TIME = 2 * 60 * 60;
  // 剩余作业时间
  test_time  = '00:00:00';
  // 定时器
  timer = null;
  // 答案解析默认折叠
  isExpand = false;

  constructor(
    public msg: NzMessageService,
    private learnHomeworkService: LearnHomeworkService,
    private homeworkResultService: HomeworkResultService,
    private homeworkDetailsService: HomeworkDetailsService,
    private modalService: NzModalService,
    private modalHelper: ModalHelper,
    // private cacheService: CacheService,

  ) {
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
    this.learnHomeworkService.queryHomework(this.homeworkId).subscribe(res => {
      this.code = '2';
      this.msg.remove();
      if (res && res.body) {
        this.code = res.body.message ;
        if (this.code === '2') {
          this.isInterruptOpen = true;
          if (res.body.data.remark) {
            this.interruptAnswerList = JSON.parse(res.body.data.remark);
          }
        }
        if (this.code === '3') {
          this.disabled = true;
        }
        const recond = res.body.data;
        this.homework = recond;
        this.dataList = recond.eduHomeworkTypeDTOList;
        this.TEST_TIME = recond.homeworkHours;
        if (this.code === '1') {
          this.TEST_TIME = this.TEST_TIME * 60;
        }
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
      id : this.homeworkDetailsId,
      eduStudyHmResultId: this.homeworkResultId,
      answerList: pageAnswer
    };
    this.homeworkResultService.submitEduStudyHmResult(param).subscribe(res => {
      if (res && res.body) {
        const code = res.body.code ;
        if (code !== '1') {
          this.msg.error(res.body.message);
        } else {
          this.msg.success('提交成功，正在计算成绩请稍后');
          const recond = res.body.data;
          this.submitFinish.emit(recond);
          this.radioAnswer = [];
          this. multipleAnswer = [];
          this.judgmentAnswer = [];
          this.radioList = [];
          this.multipleList = [];
          this. judgmentList = [];
          this.getHomework();
        }
      }
    });
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



  // 作业倒计时  -- 每秒向本地缓存一次，中断时可拿回答案内容
  countDown() {
    this.timer = setInterval(() => {
      this.TEST_TIME--;
      if (this.TEST_TIME < 0) {
        this.disabled = true;
        // this.doSubmit();
        this.TEST_TIME = 0;
        clearInterval(this.timer);
      }
      const h = Math.floor(this.TEST_TIME / (60 * 60));
      const H = h * 60 * 60;
      const M = this.TEST_TIME - H;
      const m = Math.floor(M / 60);
      const s = M - m * 60;
      this.test_time = `0${h}:${String(m).length > 1 ? m : '0' + m }:${String(s).length > 1 ? s : '0' + s }`;
      // this.cacheService.set('homework_radioAnswer', this.radioAnswer);
      // this.cacheService.set('homework_judgmentAnswer', this.judgmentAnswer);
      // this.cacheService.set('homework_multipleAnswer', this.multipleAnswer);
    }, 1000);
  }
}
