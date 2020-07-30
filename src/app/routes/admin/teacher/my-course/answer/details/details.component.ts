import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FileUploadService } from '@shared/components/fileUpload/fileUpload.service';
import { ReturnStatement } from '@angular/compiler';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { LearnService } from 'app/routes/course/learn/learn.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LikePoints } from 'app/routes/course/learn/like-points/like-points.model';
import { LikePointsService } from 'app/routes/course/learn/like-points/like-points.service';

@Component({
  selector: 'app-answer-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class AnswerDetailsComponent implements OnInit {
  // 分页数据
  total = 0;
  page = 1;
  size = 10;
  // 实体id
  entityId = '';
  submitting = false;
  @Input() courseId = '';
  @Input() catalogId = '';
  @Input() catalogName = '';
  @Output() openAnware = new EventEmitter();

  curCourseHourId = '';
  questionList = [];
  question: {};
  forms: FormGroup;
  queryParams = {
     'sort': ['orderNum,asc'],
     'isOk.equals': '1'
  };
  constructor(
    private likePointsService: LikePointsService,
    private routerInfo: ActivatedRoute,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private learnService: LearnService,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.entityId = this.tokenService.get().entity_id;
    this.courseId = this.routerInfo.snapshot.queryParams['courseId'];
    this.catalogId = this.routerInfo.snapshot.queryParams['catalogId'];
    this.catalogName = this.routerInfo.snapshot.queryParams['catalogName'];
    this.forms = this.fb.group({
      description: [null], // 内容
    });
  }

  ngOnInit() {
    this.loadData();
  }
  // 加载数据
  loadData() {
    this.msg.remove();
    this.msg.loading('加载中');
    this.getCourseQuestions();
}
  // 通过课程的id获取课程的答疑
  getCourseQuestions() {
    const param = {
      page: this.page - 1,
      size: this.size,
      sort: ['publish_time,desc']
    };
    this.learnService.getCatalogAnswerList(this.catalogId, param).subscribe((res: any) => {
      this.questionList = res.body;
      this.total = res.headers.get('x-total-count');
      this.msg.remove();
      let topicIds = '';
      let topicReplyIds = '';
      this.questionList.forEach(ele => {
        topicIds = topicIds + ',' + ele.id;
        if (ele.reply && ele.reply !== null && ele.reply.length > 0) {
          ele.reply.forEach(val =>{
            topicReplyIds = topicReplyIds + ',' + val.id;
          });
        }
      });
      this.readTopicMsg(topicIds, topicReplyIds);
    });
  }

  // 点赞
  addLikePoint(item) {
    const param = new LikePoints();
    param.courseId = this.courseId;
    param.courseCatalogId = item.courseCatalogId;
    param.likePointTime = new Date();
    param.topicId = item.id;
    param.entityId = this.entityId;
    this.likePointsService.create(param).subscribe(res => {
      const recond = res.body;
      if (recond && recond.id && recond.id !== null) {
        item.like_points = item.like_points + 1;
        item.likePoints = true;
        this.msg.info('点赞成功');
      }
    });
  }
  // 取消点赞
  removeLikePoint(item) {
    this.likePointsService.deleteByTopicId(item.id).subscribe(res => {
      item.likePoints = false;
      item.like_points -- ;
    });
  }

  
    // 打开回复框
  slideToggleReplyBox(i) {
    $('#reply-box-' + i).slideToggle('fast');
  }

    // 添加子回复
  reply(item: any) {
    const record  = {
      eduTopicId : item.id,
      replyUser : this.entityId,
      parentId :  item.id,
      isTop : '1',
      isGet : '1',
      likePoints : '0',
      replyTime : new Date(),
      description :   this.forms.controls['description'].value
    };
    this.submitting = true;
    this.learnService.saveQuestionReply(record).subscribe((resp) => {
      if (resp.body && resp.body.id !== null) {
        this.forms.controls['description'].setValue('');
        item.replyNum ++;
        this.msg.info('回复成功');
        this.getCourseQuestions();
        // this._close(true);
      } else {
        this.msg.info('添加失败');
        // this._close(false);
      }
      this.submitting = false;
    });
  }

  pageIndexChange() {
    this.getCourseQuestions();
  }

  // 已读消息
  readTopicMsg(topicIds: string, topicReplyIds: string) {
    const param = {
      topicIds : topicIds.substr(1),
      topicReplyIds : topicReplyIds.substr(1),
    };
    this.learnService.readTopicAndTopicReply(param).subscribe(res => {
      console.log('已读成功');
    });
  }


}
