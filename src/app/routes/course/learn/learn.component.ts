import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { EvaluateModalComponent } from './evaluate-modal/evaluate-modal.component';
import { LearnService } from './learn.service';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EduCourseCatalogTreeNodeModel } from './EduCourseCatalog.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { SysFileService } from '@shared/sysfile/SysFile';
import { DatePipe } from '@angular/common';
import { FollowService } from './follow/follow.service';
import { LikePointsService } from './like-points/like-points.service';
import { LikePoints } from './like-points/like-points.model';
import { FileUploadService } from '@shared/components/fileUpload/fileUpload.service';
import { StudyInfoService } from './study-info/study-info.service';
import { StudyInfo } from './study-info/study-info.model';
import { StudyHistory } from './study-history/study-history.model';
import { HistoryDetailsService } from './study-history/study-history.service';
import { LearnHomeworkService } from './homework/homework.service';
import { LearnExamService } from './exam/exam.service';
import { Exam } from 'app/routes/admin/teacher/examine/exam.model';
@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.less']
})
export class LearnComponent implements OnInit {
  @ViewChild('wd') wd: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('favorablePriceRemark') favorablePriceRemark: ElementRef;
  // 分页数据
  total = 0;
  page = 1;
  size = 10;
  // 课时list
  dataSet = [];
  params = {};
  paramslist = {};
  // 教师用户id
  teacherUserId = '';
  // 是否关注
  isFollow = false;
  activeIndex = 0;
  loading = false;
  // 课程实体
  courseInfo: any = {};
  belongUserId: string;
  expandDataCache = {};
  personMajor: any = {}; // 所授专业
  honor: any = {}; // 所获荣誉
  achievements: any = {}; // 所获成果
  // 是否登录
  isLogin = false;
  // 实体id
  entityId = '';
  // 用户id
  userId = '';
  // 实体名
  personName = '';
  // 答疑List
  questionList = [];
  question: {};
  form: FormGroup;
  forms: FormGroup;
   // 课程id
  courseId: string;
   // 课程名称
  courseName: string;
  submitting = false;
  // 当前课时名称
  typeName: string;
  // 当前课时id
  courseCatalogId = '';
  // 图片预览前缀
  imagePrefix: string;
  // 下载课件前缀
  downloadPrefix: string;
  // 视频播放前缀
  videoPrefix: string;
  // 学习历史主表记录
  studyInfo = new StudyInfo();
  // 学习历史详情
  studyHistory = new StudyHistory();
  // addEventListener
  isAddEventListener = false;

  isShowBiginBtn = true;

  // 是否含有作业
  isHasHomework = false;

  // 是否含有考试
  isHasExam = false;

  // 考试list
  examList: Exam[];

  // 作业list 兼容多个作业
  homeworkList = [];

  isOpenTest = false;

  // 考试时间 s
  TEST_TIME = 2. * 60 * 60;
  // 剩余考试时间
  test_time  = '02:30:00';
  // 定时器
  timer = null;
  speedTimer = null;
  currentTab = 0;

  mainTabs = [
    { name: '视频', icon: '/assets/icons/video.png' , url : ''},
    { name: 'PPT', icon: '/assets/icons/ppt.png', url : ''},
    { name: '文档', icon: '/assets/icons/doc.png' , url : ''},
  ];
  resourceList = [
    { name: '', type: 'video', size: '0', 'url': '', 'isShow' : false },
    { name: '', type: 'ppt', size: '0', 'url': '' , 'isShow' : false},
    { name: '', type: 'doc', size: '0', 'url': '' , 'isShow' : false},
  ];
  video: any;
  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    public msg: NzMessageService,
    private modalHelper: ModalHelper,
    private elementRef: ElementRef,
    private learnService: LearnService,
    private httpAddressService: HttpAddressService,
    private routerInfo: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private followService: FollowService,
    private datePipe: DatePipe,
    private router: Router,
    private sysFileService: SysFileService,
    private likePointsService: LikePointsService,
    private studyInfoService: StudyInfoService,
    private learnHistoryService: HistoryDetailsService,
    private learnHomeworkService: LearnHomeworkService,
    private learnExamService: LearnExamService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    (<any>window).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';

    const token = this.tokenService.get().token;
    this.courseId = this.routerInfo.snapshot.queryParams['courseId'];
    this.teacherUserId = this.routerInfo.snapshot.queryParams['teacherUserId'];
    this.courseCatalogId = this.routerInfo.snapshot.queryParams['catalogId'];
    this.personName = this.tokenService.get().entity_name; // 登录人
    this.userId = this.tokenService.get().user_id; // 登录id
    this.entityId = this.tokenService.get().entity_id;
    if (token && token !== null && token !== '') {
      this.isLogin = true;
    } else {
      // 没登录跳回首页
      this.router.navigateByUrl('/home');
    }
    this.imagePrefix = this.httpAddressService.apiGateway + this.httpAddressService.systemServe + '/sys-files/download/';
    this.downloadPrefix =  this.httpAddressService.apiGateway + this.httpAddressService.systemServe + '/sys-files/download/';
    this.videoPrefix = this.httpAddressService.apiGateway + this.httpAddressService.EduWebServe + '/edu-courses/view/';
    this.form = this.fb.group({
      description: [null], // 内容
    });
    this.forms = this.fb.group({
      description: [null], // 内容
    });
  }

  // 初始化页面
  ngOnInit() {

    this.getCourseInfo();
    this.getCourseQuestions();
    this.isFollowTeacher();
  }

  biginTest(item: any) {
    if (this.isOpenTest === true) {
      this.msg.error('已经开始作业，请提交后开始答题');
      return;
    }
    this.isOpenTest = true;
    item.isShowBiginBtn = false;
    this.countDown();
  }

  viewTest(item: any) {
    item.isShowBiginBtn = false;
  }

  // 考试倒计时
  countDown() {
    this.timer = setInterval(() => {
      this.TEST_TIME--;
      if (this.TEST_TIME < 0) {
        this.TEST_TIME = 0;
        clearInterval(this.timer);
      }

      const h = Math.floor(this.TEST_TIME / (60 * 60));
      const H = h * 60 * 60;
      const M = this.TEST_TIME - H;
      const m = Math.floor(M / 60);
      const s = M - m * 60;
      this.test_time = `0${h}:${String(m).length > 1 ? m : '0' + m }:${String(s).length > 1 ? s : '0' + s }`;

    }, 1000);
  }

  // 获取作业
  getHomeWorkMsg() {
    this.learnHomeworkService.queryHomeworkMsg(this.courseId, this.courseCatalogId).subscribe(res => {
      if (res && res.body && res.body.code === '1') {
        this.isHasHomework = true;
        const reconds = res.body.data;
        this.homeworkList = reconds;
        let type = '';
        if (reconds && reconds.length > 0) {
          this.homeworkList.forEach(e0 => {
            e0.isShowBiginBtn = true;
            const typeList = e0.eduHomeworkTypeDTOList;
            if (typeList && typeList.length > 0) {
              typeList.forEach(e => {
                  if (e.subjectType === '0' && e.subjectQuantity > 0) {
                    e.type = '单选';
                    type += '、' + e.type;
                  }
                  if (e.subjectType === '1' && e.subjectQuantity > 0) {
                    e.type = '多选';
                    type += '、' + e.type;
                  }
                  if (e.subjectType === '2' && e.subjectQuantity > 0) {
                    e.type = '判断';
                    type += '、' + e.type;
                  }
                });
                e0.type = type.substring(1);
            }
          });
        }
      } else {
        this.isHasHomework = false;
      }
    });
  }

  // 获取考试
  getExamMsg() {
    this.learnExamService.queryByCourseId(this.courseId).subscribe(res => {
      const reconds = res.body;
      this.examList = reconds;
      if (reconds && reconds.length > 0) {
          this.isHasExam = true;
      } else {
        this.isHasExam = false;
      }
    });
  }

  // 改变分数状态 -- 接收从子组件提交后的变更
  updateHomework(item: any) {
    this.homeworkList.forEach(e => {
      if (e.id === item.eduHomeworkId) {
          e.remark = item.totalGetScore;
          this.isOpenTest = false;
      }
    });
  }

  /**
   * 根据课程ID获取课程信息
   * @param courseId
   */
  getCourseInfo() {
    this.learnService.getCourseInfo(this.courseId).subscribe((subres: any) => {
      this.courseInfo = subres;
      this.courseName =  this.courseInfo.courseName;
      this.getExamMsg();
      this.findPageDatalist();
    });
  }

    /**
   * 列表查询课程章节树
   */
  findPageDatalist() {
    this.params = {
      'eduCourseId.equals': this.courseId,
      'sort': 'orderNum,asc'
    };
    this.learnService.getCourselist(this.params).subscribe((res: any) => {
      if (res && res.body && res.body !== null) {
        this.dataSet = res.body;
        if (this.dataSet.length > 0) {
          this.typeName = this.dataSet[0].name;
          if (!this.courseCatalogId || this.courseCatalogId === '') {
            this.courseCatalogId = this.dataSet[0].id;
            this.getHomeWorkMsg();
          }
          this.getCourseFile(this.courseCatalogId);
          this.dataSet.forEach((item, index) => {
            if (this.courseCatalogId === item.id) {
              this.activeIndex = index;
            }
            this.expandDataCache[item.label] = this.convertTreeToList(item);
            item.duration = this.formatDuration(item.duration);
          });

        }
        this.loading = false;
        this.updateOrSaveStudyInfo(this.studyInfo);
        this.updateOrSaveStudyHistory(this.studyHistory);
      }
    });
  }

  // 增加或者更新学习历史主表
  updateOrSaveStudyInfo(info: StudyInfo) {
    // 添加记录 -- 仅第一次
    if (!info.eduCourseId || info.eduCourseId === null) {
      info.eduCourseId = this.courseId;
      info.eduCatalogId = this.courseCatalogId;
      info.eduStudentId = this.entityId;
    }
    this.studyInfoService.updateOrSave(info).subscribe(v => {
      if (v && v !== null) {
         this.studyInfo = v;
       }
    });
  }

  // 增加或者更新学习历史详情表
  updateOrSaveStudyHistory(history: StudyHistory) {
    // 添加记录 -- 仅第一次
    if (!history.eduCourseId || history.eduCourseId === null) {
      history.eduCourseId = this.courseId;
      history.eduCatalogId = this.courseCatalogId;
      history.eduStudentId = this.entityId;
      history.studyHours = 1;
      history.studyTime = new Date();
      this.learnHistoryService.createHistory(history).subscribe(v => {
        if (v && v !== null) {
           this.studyHistory = v.body;
         }
      });
    } else {
      history.studyHours =  history.studyHours;
      this.learnHistoryService.updateHistory(history).subscribe(v => {
        if (v && v !== null) {
           this.studyHistory = v.body;
         }
      });
    }
  }

  // 获取课件
  getCourseFile(catalogId: string) {
    const param = {
      'fileFk.equals' : catalogId
    };
    // 先判断用户能不能观看此视频
    this.learnService.isCanViewCatalog(catalogId).subscribe(r => {
      if (r !== true) {
        // const uri = '/course/detail?courseId=' + this.courseId;
        // this.router.navigateByUrl(uri);
        this.msg.remove();
        this.msg.info('请购买后学习');
        return;
      }
      this.getHomeWorkMsg();
      this.msg.loading('');
      this.sysFileService.query(param).subscribe( res => {
        const reconds = res.body;
        this.mainTabs[0]['url'] = '';
        this.mainTabs[1]['url'] = '';
        this.mainTabs[2]['url'] = '';
        this.initResourceList();
        if (reconds && reconds !== null && reconds.length > 0) {
          reconds.forEach(val => {
            if (val.extField1 === '0') {
              setTimeout(() => {
                this.mainTabs[2]['url'] = this.imagePrefix + val.id;
               }, 3000);
              this.resourceList[2]['isShow'] = true;
              this.resourceList[2]['name'] = val.fileName;
              this.resourceList[2]['size'] = this.fileUploadService.readablizeBytes(val.fileSize);
              this.resourceList[2]['url'] = this.downloadPrefix + val.id;
            }
            if (val.extField1 === '1') {
              setTimeout(() => {
                this.mainTabs[1]['url'] = this.imagePrefix + val.id;
              }, 3000);
              this.resourceList[1]['isShow'] = true;
              this.resourceList[1]['name'] = val.fileName;
              this.resourceList[1]['size'] = this.fileUploadService.readablizeBytes(val.fileSize);
              this.resourceList[1]['url'] = this.downloadPrefix + val.id;
            }
            if (val.extField1 === '2') {
              this.mainTabs[0]['url'] = this.videoPrefix + val.id;
              this.resourceList[0]['isShow'] = true;
              this.resourceList[0]['name'] = val.fileName;
              this.resourceList[0]['size'] = this.fileUploadService.readablizeBytes(val.fileSize);
              this.resourceList[0]['url'] = this.downloadPrefix + val.id;
            }
          });
          if (this.speedTimer) {
            clearInterval(this.speedTimer);
          }
          this.initTimer();
        }
      });

    });
  }

  // 通过课程的id获取课程的答疑
  getCourseQuestions() {
    const param = {
      page: this.page - 1,
      size: this.size,
      sort: ['publish_time,desc']
    };
    this.learnService.getAnswerList(this.courseId, param).subscribe((res: any) => {
      this.questionList = res.body;
      this.total = res.headers.get('x-total-count');
    });
  }

  getQuestionsList(parentId) {
    this.learnService.gettopicreplies(parentId).subscribe((res: any) => {
      this.question = res.data;
    });
  }

  // 是否关注老师
  isFollowTeacher() {
    this.followService.isHasFollow(this.teacherUserId).subscribe(res => {
      this.isFollow = res;
    });
  }

  // 关注
  addFollowTeacher() {
    const param = {
      'eduCourseId': this.courseId,
      'followTime': this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') + 'Z',
      'followUserId': this.teacherUserId,
      'userId': this.userId
    };
    this.followService.followTeacher(param).subscribe(res => {
      const recond = res.body;
      if (recond && recond.id && recond.id !== null) {
        this.msg.remove();
        this.msg.info('关注成功');
        this.isFollow = true;
      }
    });
  }

  // 取消关注
  removeFollowTeacher() {
    this.followService.removeFollow(this.teacherUserId).subscribe(res => {
      this.msg.remove();
      this.msg.info('取消关注成功');
      this.isFollow = false;
    });

  }


  // 点赞
  addLikePoint(item) {
    const param = new LikePoints();
    param.courseId = this.courseId;
    param.courseCatalogId = this.courseCatalogId;
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


  pageIndexChange() {
    this.getCourseQuestions();
  }


  // 打开评论框
  openEvaluateModal() {
    this.modalHelper.open(EvaluateModalComponent,
      { courseName: this.courseInfo.courseName }, 680,
      { nzClassName: 'evaluate-modal' }).subscribe(() => {
      });
  }

  changeCourseFile() {

    console.log('aa');
  }

  // 选中课时后执行   --新建
  selectItem(i) {
    this.currentTab = 0;
    this.activeIndex = i;
    this.typeName = this.dataSet[i].name;
    this.courseCatalogId = this.dataSet[i].id;
    this.getCourseFile( this.dataSet[i].id);
    this.updateOrSaveStudyInfo(new StudyInfo());
    this.updateOrSaveStudyHistory(new StudyHistory());
  }

  // 打开回复框
  slideToggleReplyBox(i) {
    $('#reply-box-' + i).slideToggle('fast');
  }


  // 添加答疑
  _submit() {
    const record  = {
      eduCourseId : this.courseId,
      publisher : this.entityId,
      courseCatalogId :  this.courseCatalogId,
      courseCatalogName :  this.typeName,
      eduCourseName: this.courseName,
      isTop : '1',
      type : '0',
      likePoints : '0',
      replyNum: 0,
      publishTime : new Date(),
      description :  this.form.controls['description'].value
    };
    this.learnService.saveQuestionList(record).subscribe((resp) => {
      if (resp.body && resp.body.id !== null) {
        this.msg.info('添加成功');
        this.form.controls['description'].setValue('');
        this.getCourseQuestions();
        this._close(true);
      } else {
        this.msg.info('添加失败');
        this._close(false);
      }
      this.submitting = false;
    });
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
        this._close(true);
      } else {
        this.msg.info('添加失败');
        this._close(false);
      }
      this.submitting = false;
    });
  }
   /**
   * 组件关闭
   * @param refresh
   */
  _close(refresh: boolean) {
    // this.modal.destroy(refresh);
  }


  // 格式化视频时间
  formatDuration(duration: number) {
    if (!duration || duration === null) {
      return '无';
    }
    let hour = '0';
    let min = '0';
    let sec = '0';
    // 小时
    if (duration > 60 * 60) {
      const tmp = Math.floor(duration / (60 * 60));
      duration = duration % (60 * 60);
      if (tmp < 10) {
        hour = hour + tmp ;
      } else {
        hour = tmp + '';
      }
    }
    // 分钟
    if (duration > 60) {
      const tmp = Math.floor(duration / 60);
      duration = duration % 60;
      if (tmp < 10) {
        min = min + tmp;
      } else {
        min = tmp + '';
      }
    }
    // 秒
    if (duration < 10) {
      sec = sec + duration;
    } else {
      sec = duration + '';
    }

    if (hour !== '0') {
      return hour + ':' + min + ':' + sec;
    }
    return  min + ':' + sec;
  }


  /**
   * 讲树转换成列表
   * @param root
   */
  convertTreeToList(root: object): EduCourseCatalogTreeNodeModel[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true }); // 默认展开
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: true, parent: node }); // 默认展开
        }
      }
    }
    return array;
  }
  /**
   * 遍历节点
   * @param node
   * @param hashMap
   * @param array
   */
  visitNode(node: EduCourseCatalogTreeNodeModel, hashMap: object, array: EduCourseCatalogTreeNodeModel[]): void {
    if (!hashMap[node.label]) {
      hashMap[node.label] = true;
      array.push(node);
    }
  }


  private initResourceList() {
    this.resourceList = [
      { name: '无', type: 'video', size: '0', 'url': '', 'isShow' : false },
      { name: '无', type: 'ppt', size: '0', 'url': '', 'isShow' : false},
      { name: '无', type: 'doc', size: '0', 'url': '', 'isShow' : false},
    ];
  }

  // 初始化定时器
   initTimer() {
    // 每63秒向后台请求一次，记录视频观看时间 ,考虑可能有延迟 延迟3秒
    this.speedTimer = setInterval(() => {
    this.video =  this.elementRef.nativeElement.querySelector('.course-video');
  //  if (this.isAddEventListener === false) {
    // 暂停播放事件 发送数据给后台
   //   this.isAddEventListener = true;
      this.video.onpause = () => {
        this.studyHistory.studyHours = Math.ceil(this.video.currentTime) / 60;
        this.updateOrSaveStudyHistory(this.studyHistory);
      };
    // 结束播放事件 更新数据 并关闭定时器
      this.video.onended = () => {
        // this.studyHistory.studyHours = Math.ceil(this.video.currentTime) / 60;
        // this.updateOrSaveStudyHistory(this.studyHistory);
        if (this.speedTimer) {
          clearInterval(this.speedTimer);
        }
      };
    // 重新开始播放事件 创建历史记录
      this.video.oncanplay = () => {
        this.updateOrSaveStudyHistory(new StudyHistory());
      };
  //  }
    // 视频播放时执行
      if (this.video.paused === false) {
        this.studyHistory.studyHours = Math.ceil(this.video.currentTime) / 60;
        this.updateOrSaveStudyHistory(this.studyHistory);
      }
    }, 63000);
  }



  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.speedTimer) {
      clearInterval(this.speedTimer);
    }
  }


  getStudyHistory() {
    return this.studyHistory;
  }
}
