import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'app/routes/course/course.service';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpAddressService } from '@shared/session/http-address.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { DictService } from '@shared/components/dict/dict.service';
import { DictDetailService } from '@shared/components/dict/dict-detail.service';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.less']
})
export class MyCourseComponent implements OnInit {
  // 显示模态框
  isVisible = false;
  // 增加课程名
  addCourseName = '';
  // 当前tab序号
  currentIndex = 0;
  // 当前分页
  page = 1;
  // 分页大小
  size = 8;
  // 数据总数
  totals = ['0', '0', '0'];
  // 教师实体id
  teacherId = '';
  // 图片前缀
  imgPrefix = '';
  // 默认图片地址
  defaultImg = '/assets/images/course-cover-img.png';
  // 课程类别字典No
  COURSE_TYPE = 'CourseClassType';
  titles = [
    { title: '特色课程班', classifyId: '', name: '', 'courseTypeId': '' },
    { title: '专业课程班', classifyId: '', name: '', 'courseTypeId': '' },
    { title: '教学课程班', classifyId: '', name: '', 'courseTypeId': '' }
  ];
  CourseList = [[], [], []];
  constructor(
    private router: Router,
    private courseService: CourseService,
    public msg: NzMessageService,
    private dictService: DictService,
    private dictDetailService: DictDetailService,
    httpAddressService: HttpAddressService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.teacherId = tokenService.get().entity_id;
    this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterContentInit(): void {
    let lis = $('.course-list li');
    if (this.isIE()) {
      debugger
      lis.css('width', '341px');
    }
  }

  isIE() {
    const userAgent = navigator.userAgent; 
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    return isIE || isIE11;
  }

  nextPage() {
    this.router.navigateByUrl('/admin/teacher/my-course/class');
  }

  loadData() {
    this.loadTitle();
  }

  // 加载tab页标题
  loadTitle() {
    this.msg.loading('加载中', { nzDuration: 60000 });
    const param = {
      'dictNo.equals': this.COURSE_TYPE,
      'isOk.equals': '1'
    };
    this.dictService.query(param).subscribe(res => {
      const records = res.body;
      if (records && records !== null && records.length > 0) {
        this.getDictDetials(records[0].id);
      }
    });
  }

  // 获取字典详情
  getDictDetials(id: string) {
    const tmpParam = {
      'parentId.specified': false,
      'sysDictId.equals': id,
      'sort': ['orderNum,asc'],
      'isOk.equals': '1'
    };
    this.dictDetailService.query(tmpParam).subscribe(r => {
      const vals = r.body;
      if (vals && vals !== null && vals.length > 0) {
        vals.forEach((val, index) => {
          this.titles[index].title = val.itemText;
          this.titles[index].classifyId = val.itemValue1;
          this.titles[index].name = val.itemValue3;
          this.titles[index].courseTypeId = val.itemValue2;
          this.getList(val.itemValue1, index);
        });
      }
    });
  }

  // 获取课程列表
  getList(category: string, index: number) {
    const queryParam = {
      'isDelete.equals': '0',
      'teacherId.equals': this.teacherId,
      'classifyId.equals': category,
      'page': this.page - 1,
      'size': this.size,
      'sort': ['orderNum,desc']
    };
    this.courseService.queryCourse(queryParam).subscribe(res => {
      const records = res.body;
      if (records && records.length > 0) {
        records.forEach(record => {
          if (record.remark === null || record.remark === '') {
            record.courseCoverUrl = this.defaultImg;
          } else {
            record.courseCoverUrl = this.imgPrefix + record.remark;
          }
        });
        this.totals[index] = res.headers.get('X-Total-Count');
      }
      this.msg.remove();
      this.CourseList[index] = records;
    });
  }

  pageIndexChange() {
    this.getList(this.titles[this.currentIndex].classifyId, this.currentIndex);
  }

  // 删除课程
  deleteCourse(id: string) {
    this.courseService.updateIsDelete(id, 2).subscribe(res => {
      if (res && res.success && res.success === true) {
        this.msg.info('删除成功');
        this.pageIndexChange();
      }
    });
  }

  // 增加课程
  addCourse() {
    const param = {
      'courseName': this.addCourseName,
      'classifyId': this.titles[this.currentIndex].classifyId,
      'classifyName': this.titles[this.currentIndex].name,
      'orderNum': this.totals[this.currentIndex]
    };
    this.courseService.createCourse(param).subscribe(res => {
      const recond = res.body;
      if (recond && recond !== null) {
        this.msg.info('增加成功');
        this.addCourseName = '';
        this.pageIndexChange();
      }
      this.isVisible = false;
    });
  }

  // 发布课程
  publishCourse(item: any) {
    this.courseService.updateIsPublish(item.id, '1').subscribe(res => {
      const recond = res;
      if (res && res.success && res.success === true) {
        this.msg.info('发布成功');
        item.isPublish = '1';
      }
    });
  }



  selectedIndexChange() {
    this.page = 1;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.addCourse();
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}
