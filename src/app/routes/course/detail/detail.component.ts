import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailService } from './detail.service';
import { HttpAddressService } from '@shared/session/http-address.service';
import { ModalHelper } from '@delon/theme';
import { EduCourseCatalogTreeNodeModel } from '../learn/EduCourseCatalog.model';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { UserLoginComponent } from 'app/routes/passport/login/login.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NzNotificationService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SummarizeService } from 'app/routes/admin/teacher/my-course/info/summarize/summarize.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OrderDetailService } from './order-detail/order-detail.service';
// import { MessageHelper } from '@shared/helpers/MessageHelper';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  @ViewChild('courseAims') courseAims: ElementRef;
  @ViewChild('remark') remark: ElementRef;
  @ViewChild('favorablePriceRemark') favorablePriceRemark: ElementRef;
  @ViewChild('courseStatus') courseStatus: ElementRef;
  // 是否是老师
  isTercher = false;

  learnLoding = true;

  haveBought = false;
  // 是否收藏
  isCollected = false;
  // 是否登录
  isLogin = false;
  // 课程目录分页
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 课程目录dataSet
  dataSet = [];
  // 课程id
  courseId: string;
  // 加载中
  loading = false;
  // 购买按钮加载中
  buyLoding = false;
  // 课程信息
  courseInfo: any = {};
  expandDataCache = {};
  // 教师信息
  personMajor: any = {}; // 所授专业
  // 教师用户id
  teacherUserId = '';
  // 最后课程更新的时间
  creationTimes: Date;
  // ---- 分享功能 ----//
  _title: string;
  _source: string;
  _sourceUrl: string;
  _pic: string;
  _showcount: string;
  _desc: string;
  _summary: string;
  _site: string;
  _url: string;
  _shareUrl: string;
  // --- eng ----//
  // 当前用户id
  userId: string;

  entityId: string;
  // 课程信息
  // course = {
  //   courseName: '微软Power BI_商业数据可视化',
  //   lecturer: '赵匡义',
  //   learnNum: 511623,
  //   collectNum: 31162,
  //   totalTime: '3小时56分',
  //   curPrice: 116.00,
  //   oriPrice: 156.00,
  // };

  // 课程概述list
  summarizeList = [];

  // 图片预览前缀
  imgPrefix = '';
  constructor(
    private orderDetailService: OrderDetailService,
    private routerInfo: ActivatedRoute,
    private modalHelper: ModalHelper,
    private elementRef: ElementRef,
    private detailService: DetailService,
    private httpAddressService: HttpAddressService,
    private router: Router,
    private modalService: NzModalService,
    public msg: NzMessageService,
    public summarizeService: SummarizeService,
    public sanitizer: DomSanitizer,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private nsg: NzNotificationService,
  ) {
    const token = this.tokenService.get().token;
    this.userId = this.tokenService.get().user_id;
    this.entityId = this.tokenService.get().entity_id;
    this.imgPrefix =  this.httpAddressService.apiGateway + this.httpAddressService.systemServe + '/sys-files/download/';
    this.courseId = this.routerInfo.snapshot.queryParams['courseId'];
    if (token && token !== null && token !== '') {
      this.isLogin = true;
    }
  }

  // 初始化页面
  ngOnInit() {
    this.getCourseInfo(false);
  }

  /**
    * 根据课程ID获取课程信息
    * @param courseId
    */
  getCourseInfo(flag: boolean) {
    if (this.isLogin === true) {
      const param = {
        'eduCourseId.equals': this.courseId,
        'eduStudentId.equals': this.entityId,
        'status.equals': '1',
        'payType.specified': true
      };
      this.orderDetailService.query(param).subscribe(res => {
        const tmp = res.body;
        if (tmp && tmp !== null && tmp.length > 0) {
          this.haveBought = true;
        }
        if (flag && this.haveBought === false) {
            this.msg.info('支付失败');
        }
      });
    }
    this.detailService.getCourseInfolist(this.courseId).subscribe((res: any) => {
      this.courseInfo = res;
      this.courseInfo.time = this.totalHoursFormat(this.courseInfo.orderNum);
      if (this.isLogin === true) {
        this.detailService.isHasFavorite(this.courseId).subscribe(val => {
          this.isCollected = val;
        });
      }
      if (this.courseInfo.teacherId === this.entityId) {
         this.isTercher = true;
      }
      this.getTeacherMsg(this.courseInfo.teacherId);
      this.findPageDatalist();
    });
    this.getSummarizes();
  }

  // 获取课程概述
  getSummarizes() {
    this.summarizeService.queryByCourseId(this.courseId).subscribe(res => {
      const record = res.body;
      this.summarizeList = record;
    });
  }

 // 计算小时与分钟
  private totalHoursFormat(totalHours: number) {
    const hours = Math.floor(totalHours / 60);
    let minute = 1;
    if (totalHours >= 60){
       minute = totalHours % 60;
    }
    return hours + '小时' + minute + '分钟';
  }


  /**
  *获取教师信息
  * @param belongUserId
  */
  getTeacherMsg(teacherId: string) {
    this.detailService.getTeacherPartData(teacherId).subscribe((subs: any) => {
      this.learnLoding = false;
      if (subs && subs !== null && subs.length > 0) {
        this.personMajor = subs[0];
        this.teacherUserId = subs[0].userId;
      } else {
        this.teacherUserId = '123';
      }
    });
  }

  /**
   * 列表查询课程章节树
   */
  findPageDatalist() {
    const params = {
      'eduCourseId.equals': this.courseId,
      'sort': 'orderNum,asc'
    };
    this.detailService.getCourselisttree(params).subscribe((res: any) => {
      if (res && res.body && res.body !== null) {
        this.dataSet = res.body;
        this.total = res.headers.get('X-Total-Count');
        this.dataSet.forEach(item => {
          this.expandDataCache[item.label] = this.convertTreeToList(item);
          this.creationTimes = item.lastModifiedDate;
        });
        this.loading = false;
      }
    });
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
  // 分享功能
  // 分享到新浪微博
  shareToSinaWB($event) {
    $event.stopPropagation(); // 阻止冒泡
    $event.preventDefault(); // 阻止默认行为
    this.getShareParam();
    // tslint:disable-next-line: no-unused-expression
    document.location;
    this._shareUrl = 'http://v.t.sina.com.cn/share/share.php?title="123"';     // 真实的appkey，必选参数
    this._shareUrl += '&url=' + encodeURIComponent(this._url || location.href);     // 参数url设置分享的内容链接|默认当前页location，可选参数
    this._shareUrl += '&title=' + encodeURIComponent(this._title || document.title);    // 参数title设置分享的标题|默认当前页标题，可选参数
    this._shareUrl += '&source=' + encodeURIComponent(this._source || '');
    this._shareUrl += '&sourceUrl=' + encodeURIComponent(this._sourceUrl || '');
    this._shareUrl += '&content=' + 'utf-8';   // 参数content设置页面编码gb2312|utf-8，可选参数
    this._shareUrl += '&pic=' + encodeURIComponent(this._pic || '');  // 参数pic设置图片链接|默认为空，可选参数
    window.open(this._shareUrl, '_blank');
  }

  // 分享到QQ空间
  shareToQzone($event) {
    $event.stopPropagation(); // 阻止冒泡
    $event.preventDefault(); // 阻止默认行为
    this.getShareParam();

    // this._url =  this._url.substr(this.router.url.lastIndexOf('http://') + 8);
    this._url = 'http://www.thsware.com';
    this._shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
    this._shareUrl += 'url=' + encodeURIComponent(this._url || location.href);   // 参数url设置分享的内容链接|默认当前页location
    this._shareUrl += '&showcount=' + this._showcount || 0;      // 参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
    this._shareUrl += '&desc=' + encodeURIComponent(this._desc || '分享的描述');    // 参数desc设置分享的描述，可选参数
    this._shareUrl += '&summary=' + encodeURIComponent(this._summary || '分享摘要');    // 参数summary设置分享摘要，可选参数
    this._shareUrl += '&title=' + encodeURIComponent(this._title || document.title);    // 参数title设置分享标题，可选参数
    this._shareUrl += '&site=' + encodeURIComponent(this._site || '');   // 参数site设置分享来源，可选参数
    this._shareUrl += '&pics=' + encodeURIComponent(this._pic || '');   // 参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
    window.open(this._shareUrl, '_blank');
  }
  // 分享到qq
  shareToqq($event) {
    $event.stopPropagation(); // 阻止冒泡
    $event.preventDefault(); // 阻止默认行为
    this.getShareParam();

    this._shareUrl = 'https://connect.qq.com/widget/shareqq/iframe_index.html?';
    this._shareUrl += 'url=' + encodeURIComponent(this._url || location.href);   // 分享的链接
    this._shareUrl += '&title=' + encodeURIComponent(this._title || document.title);     // 分享的标题
    window.open(this._shareUrl, '_blank');
  }

  getShareParam() {
    this._url = location.href;
    this._title = this.courseInfo.name;
    this._desc = this.courseInfo.courseAims; //  this.courseAims;
    this._summary = this.courseInfo.remark; // this.remark;
  }
  // 免费学习
  _freelearning() {
    if (this.isLogin === false) {
      this._loginUser();
    } else {
      const courseId = this.courseId;
      const url = '/course/learn?courseId=' + courseId + '&teacherUserId=' + this.teacherUserId;
      // this.msg.info('已经登陆！');
      this.router.navigateByUrl(url);
    }
  }


  learnToCatalog(id: string) {
    const courseId = this.courseId;
    const url = '/course/learn?courseId=' + courseId + '&teacherUserId=' + this.teacherUserId + '&catalogId=' + id;
    // this.msg.info('已经登陆！');
    this.router.navigateByUrl(url);
  }

  /**
   * 登陆
   */

  _loginUser() {
    // 登录成功就直接跳转到立刻学习页面进行学习
    this.modalService.confirm({
      nzTitle: '确认确定登录?',
      nzContent: '',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.modalHelper.static(UserLoginComponent, { record: this.courseId }, 600).subscribe((data: any) => {
          if (data) {
            this.msg.info('登陆成功');
            this.isLogin = true;
          }
        });
      },
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 收藏 -- 主题是否能收藏
  _collection() {
    if (this.isLogin === false) {
      this._loginUser();
    } else {
      if (this.isCollected === true) {
        // 取消收藏
        this.removeCollection();
      } else {
        // 收藏
        this.addCollection();
      }

    }
  }

  // 收藏
  private addCollection() {
    this.detailService.addFavorite(this.courseId).subscribe(sub => {
      this.courseInfo.favoriteCount++;
      this.isCollected = true;
    });
  }

  // 取消收藏
  private removeCollection() {
    this.detailService.removeFavorite(this.courseId).subscribe(sub => {
      this.courseInfo.favoriteCount--;
      this.isCollected = false;
    });
  }

  // 例立即购买
  buyNow() {
    if (this.isLogin === false) {
      this._loginUser();
    } else {
      // 创建订单 或者 打开订单
      this.buyLoding = true;
      const param = {
        eduCourseId : this.courseId,
        payNum : '1'
      };
      this.orderDetailService.queryOrCreateOrder(param).subscribe(res => {
        if (res.body && res.body.success === true) {
          const recond = res.body.data;
          this.buyLoding = false;
          this.openOrderDetailModal(recond);
        } else {
          this.buyLoding = false;
          this.msg.error(res.body.message);
        }
      });
    }
  }

  // 打开购买窗口
  openOrderDetailModal(order: any) {
    this.modalHelper.open(OrderDetailComponent, { courseInfo: this.courseInfo, order: order }, 960).subscribe(() => {
      this.getCourseInfo(true);
    });
  }
  
}
