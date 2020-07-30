import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';
import { ModalHelper } from '@delon/theme';
import { Exam } from 'app/routes/admin/teacher/examine/exam.model';
import { LearnExamService } from './exam.service';


@Component({
  selector: 'app-learn-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.less']
})

export class LearnExamComponent implements OnInit {

  @Input() examList: Exam[] = [];

  // 考试信息
  examMsgList = [];
  // 是否已经开始了考试
  isHasExamOpen = false;
  // 题型数据
  subjectType = '';

  constructor(
    public msg: NzMessageService,
    private modalService: NzModalService,
    private modalHelper: ModalHelper,
    private cacheService: CacheService, 
    private learnExamService: LearnExamService,
  ) {
  }

  // 初始化页面
  ngOnInit() {
    this.getExam();
  }

  // 获取题目
  getExam() {
    this.learnExamService.queryExamMsgByCourseId(this.examList[0].eduCourseId).subscribe(res => {
      const reconds = res.body.data;
      if (!reconds || reconds.length === 0) {
        this.msg.error('无考试信息');
        return;
      }
     this.initOpenExam(reconds);
      this.examMsgList = reconds;
    });
  }

  initOpenExam(reconds) {
    reconds.forEach(ele => {
      ele.isOpenExam = false;
      let tmp  = '';
      if (ele.type && ele.type.length > 0) {
        ele.type.forEach(e => {
          if (e.subjectType === '0' && e.quantity > 0) {
            tmp += '、单选';
          }
          if (e.subjectType === '1' && e.quantity > 0) {
            tmp += '、多选';
          }
          if (e.subjectType === '2' && e.quantity > 0) {
            tmp += '、判断';
          }
        });
      }
      ele.subjectTypes = tmp.substring(1);
    });
  }

  openExam(item: any) {
    if (this.isHasExamOpen === false) {
      if (item.isSubmit === '2') {
        this.isHasExamOpen = true;
      }
      item.isOpenExam = true;
    } else {
      this.msg.info('请先提交已开始的考试');
    }
  }

  closeExam() {
    this.isHasExamOpen = false;
    this.getExam();
  }

    // 改变分数状态 -- 接收从子组件提交后的变更
    updateExam(item: any) {
      this.examMsgList.forEach(e => {
        if (e.id === item.eduExamId) {
            e.totalGetScore = item.totalGetScore + '';
            this.isHasExamOpen = false;
        }
      });
    }

}
