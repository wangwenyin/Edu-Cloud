import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LearnHomeworkService } from './homework.service';
import { CacheService } from '@delon/cache';
import { HomeworkResultService } from './result.service';
import { ModalHelper } from '@delon/theme';


@Component({
  selector: 'app-learn-homeworks',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.less']
})

export class LearnHomeworkComponent implements OnInit {

  @Input() homeworkList =  [];

  /**
  * 提交作业回调
  */
  @Output() submitFinish: EventEmitter<{}> = new EventEmitter<{}>();

  // 是否已经开始了作业
  isHasHomeworkOpen = false;

  constructor(
    public msg: NzMessageService,
    private learnHomeworkService: LearnHomeworkService,
    private modalService: NzModalService,
    private modalHelper: ModalHelper,
    private cacheService: CacheService,
    private homeworkResultService: HomeworkResultService
  ) {
  }

  // 初始化页面
  ngOnInit() {
    // this.getHomework();
  }

  openHomework(item: any, flag: boolean) {
    if (!flag) {
      this.doOpenHomework(item);
      return;
    }
    this.modalService.confirm({
      nzTitle: '开始测试之后将开启倒计时，倒计时结束将自动提交，是否现在开始完成作业?',
      nzContent: '',
      nzOkText: '是',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.doOpenHomework(item);
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });

  }

  doOpenHomework(item: any) {
    if (this.isHasHomeworkOpen === false) {
      if (item.isSubmit === '2') {
        this.isHasHomeworkOpen = true;
      }
      item.isShowBiginBtn = false;
      item.isOpenHomework = true;
    } else {
      this.msg.info('请先提交已开始的作业');
    }
  }


   // 改变分数状态 -- 接收从子组件提交后的变更
  updateHomework(item: any) {
    this.homeworkList.forEach(e => {
      if (e.id === item.eduHomeworkId) {
          e.remark = item.totalGetScore;
          this.isHasHomeworkOpen = false;
      }
    });
  }
}