import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { AccountService } from './teacher/account/account.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { LobDataService } from '@shared/components/lobData/lobData.service';
import { NewsService } from './teacher/news/news.service';
import { StuAccountService } from './student/account/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  // 用户类型
  entityType = '';
  // 实体id
  entityId = '';
  // 存放实体信息
  entity = {
    name: '',
    signature: null,
    discussion: '',
    likePoints: ''
  };
  // 头像地址
  headImg = '';
  // 是否有头像
  isHasHeadImg = false;
  // 注册天数
  registerNum = 0;
  // 消息数目
  messageNum = 0;

  // 学生还是老师
  isTeacher = false;
  isStudent = false;

  studentDiscussion = 0; // 学生参与讨论数

  radarChartOption: any;


  constructor(
    private titleService: Title,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private teacherServcie: AccountService,
    private newsService: NewsService,
    public sanitizer: DomSanitizer,
    private lobDataService: LobDataService,
    private stuAccountService: StuAccountService,
    private elementRef: ElementRef,
  ) {
    this.entityType = tokenService.get().entity_type;
    this.entityId = tokenService.get().entity_id;
  }

  ngOnInit() {
    this.titleService.setTitle('个人中心');
    this.loadData();
    this.initCharts();
  }

  // 加载数据
  loadData() {
    this.getMessageNum();
    this.getUserMsg();
    this.getHeadImg();
  }

  // 获取用户信息
  getUserMsg() {
    if (this.entityType === '1') {
      this.getTeacherMsg();
      this.isTeacher = true;
      return;
    }
    if (this.entityType === '0' || this.entityType === '2') {
      this.getStudentMsg();
      this.isStudent = true;
      return;
    }
  }

  // 获取学生数据
  getStudentMsg() {
    const param = {
      'id.equals': this.entityId
    };
    this.stuAccountService.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.calculationRegisterNum(reconds[0]);
        this.entity = reconds[0];
      }
    });
    this.stuAccountService.getStudentDiscussion(this.entityId).subscribe(res => {
      const num = res.body.data[0].discussionNum;
      if (null !== num && '' !== num) {
        this.studentDiscussion = num;
      }
    })


  }

  // 获取教师数据
  getTeacherMsg() {
    const param = {
      'id.equals': this.entityId
    };
    this.teacherServcie.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.calculationRegisterNum(reconds[0]);
        this.entity = reconds[0];
      }
    });
  }

  // 获取头像
  getHeadImg() {
    const param = {
      'businessType.equals': '0',
      'businessId.equals': this.entityId
    };
    this.lobDataService.query(param).subscribe(res => {
      const reconds = res.body;
      if (reconds && reconds !== null && reconds.length > 0) {
        this.isHasHeadImg = true;
        this.headImg = reconds[0].lobData;
      }
    });
  }

  // 获取消息数目
  getMessageNum() {
    this.newsService.countNews('0').subscribe(res => {
      const result = res;
      if (result && result.success && result.success === true) {
        this.messageNum = result.data;
      }
    });

  }

  // 计算注册天数
  private calculationRegisterNum(recond: any) {
    const startDate = Date.parse(recond.createdDate);
    const date = new Date();
    const endDate = Date.parse(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    this.registerNum = Math.ceil(days);
  }

  clickMyMsg() {
    this.elementRef.nativeElement.offsetParent.querySelector('#my-msg').click();
  }

  private initCharts() {

    this.radarChartOption = {
      tooltip: {
        trigger: 'axis'
      },
      color: ['#6A6BFF'],
      radar: {
        indicator: [
          { text: '生命值', max: 100 },
          { text: '攻击力', max: 100 },
          { text: '法力', max: 100 },
          { text: '速度', max: 100 }
        ],
        center: ['50%', '50%'],
        radius: 80
      },
      series: [
        {
          name: '学生技能分析',
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          areaStyle: {},
          data: [
            {
              value: [60, 73, 85, 40]
            }
          ]
        }
      ]
    };

  }

}
