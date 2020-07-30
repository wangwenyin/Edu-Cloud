import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { environment } from '@env/environment';
import { HttpAddressService } from '@shared/session/http-address.service';
import { ListService } from './list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @ViewChild('courseStatus') courseStatus: ElementRef;
  params = {
    // 'page': '0',
    // 'size': '16',
    // // 'sort': 'creation_time,asc'
  };
  page = 0 ;
  size = 16 ;
  param = {};
  total = 0;
  pageIndex = 1;
  imgSrc: string;
  typeid: string;
  typename: string;
  typeRootID: string;
  typeName: string;
  cousename: string;
  tabName = '全部';
  typeList: any[] = [];
  searchCourseName = '';
  CourseList: any[] = [];
  courseType: any[] = [];
  courseTypelist: any[] = [];
  courseTypeaylist: any[] = [];
  constructor(
    private elementRef: ElementRef,
    private listService: ListService,
    private httpAddressService: HttpAddressService,
    private routerInfo: ActivatedRoute,
    private router: Router
     ) {
      //  图片的展示路径
      this.imgSrc = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files/download/';

     }

  isShowMore = false;
  classifyList = [
    {
      name: '专业知识',
      sub_classify: [
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化',
      // 'BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化'
    ]
    },
    {
      name: '建筑知识',
      sub_classify: ['工程设计类软件培训', '建筑专业平法软件', '计量与计价实操', '工程设计类软件培训']
    },
    {
      name: '知识概要',
      sub_classify: ['BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化']
    },
    {
      name: '理论知识',
      sub_classify: ['BIM项目案例分析', 'BIM土建算量实操', 'BIM安装算量实操', 'BIM技术及建设行业信息化']
    }
  ];
  // 1全部 2 即将结束 3 以完结
  courseList = [
    {
      name: '全部',
      Key: ' ',
    },
    {
      name: '进行中',
      Key: '1',
    },
    {
      name: '已结束',
      Key: '2',
    }
  ];



  ngOnInit() {
    this.typeRootID =  this.routerInfo.snapshot.queryParams['typeid'];
    this.typeName = this.routerInfo.snapshot.queryParams['typename'];
    this.getcourseType();
    this.getCourseByid();
  }

  toggleShow() {
    this.isShowMore = !this.isShowMore;
  }

  getStyle() {
    return this.isShowMore ? { height: 'auto', 'max-height': '1000px' } : { height: '', 'max-height': '150px'};
  }

  goDetailPage() {
    this.router.navigateByUrl('/course/detail');
  }

  getcourseType() {
    this.listService.findPageByCoursetype(this.typeRootID).subscribe((sub: any) => {
      this.courseTypelist = sub.body.data;
      for (let index = 0; index <  this.courseTypelist.length; index++) {
        const classifytype =  this.courseTypelist[index].courseType;
        this.gettypelist(classifytype);
      }
    });
  }
  gettypelist(classifytype: string) {
    this.listService.getcourselist(this.typeRootID, classifytype).subscribe((sub: any) => {
      this.courseTypeaylist = sub.data;
    });
  }
  onTabSelect(item: any) {
    this.params['courseType.equals'] = item;
    this.tabName = item;
    this.gettypelist(item);
    this.getCourseByid();
  }
  onTabcousename(item: any) {
    this.params['courseName.equals'] = item;
    this.cousename = item;
    this.getCourseByid();
  }
  /**
   * 查找课程
   */
  _search() {
    if (this.searchCourseName && '' !== this.searchCourseName.trim()) {
      this.params['courseName.contains'] = this.searchCourseName;
    } else {
      if (this.params['courseName.contains']) {
        delete this.params['courseName.contains'];
      }
    }
    this.getCourseByid();
  }
   // 根据分类id获取课程的数据 1全部 2 即将结束 3 以完结
  tabTo(item: any) {
    if (item.Key === '1') {
      this.tabName = '进行中';
      this.params['courseStatus.equals'] = '1';
      this.getCourseByid();
    } else if (item.Key === '2') {
      this.tabName = '已结束';
      this.params['courseStatus.equals'] = '2';
      this.getCourseByid();
    }  else {
      this.tabName = '全部';
      this.getCourseByid();
    }
  }
  // 根据分类id获取课程的数据 1全部 2 即将结束 3 以完结
  getCourseByid() {
    this.params['classifyId.equals'] = this.typeRootID;
    this.params['isPublish.equals'] = '1';
    this.params['isDelete.equals'] = '0';
    this.params['page'] = this.page - 1;
    this.params['size'] = this.size;
    this.listService.findPageByCourseId(this.params).subscribe((subres: any) => {
      this.CourseList = subres.body;
      this.total = subres.headers.get('X-Total-Count');
    });
  }
  comprehensive() {
    this.params['sort'] = ['orderNum,asc'];
    this.getCourseByid();
  }
  Newest() {
    this.params['sort'] = ['updateSection,asc'];
    this.getCourseByid();
  }
  watch() {
    this.params['sort'] = ['subscibeCount,asc'];
    this.getCourseByid();
  }
  collection() {
    this.params['sort'] = ['subscibeCount,asc'];
    this.getCourseByid();
  }
  /**
* 页码数量变动事件
* @param
*/
pageIndexChange(event) {
  this.page = event;
  this.getCourseByid();
}
pageSizeChange(event) {
  this.size = event;
  this.getCourseByid();
}
}
