import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less']
})
export class CourseComponent implements OnInit {
  params = {};
  dataSet: any[] = [];
  bannerset = [];
  imagePrefix = '';
  personAvatarSRC = '';
  ItemTypeListArray: any[] = [];

  constructor(
    private courseService: CourseService,
    private httpAddressService: HttpAddressService,
  ) {
    this.imagePrefix = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files/download/';
  }

  courseList = [
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' },
    { courseName: '全干开发工程师', learnNum: 25454, updateStatus: 8, src: '/assets/images/u131.png' }
  ];

  // 视口宽度(包括滚动条)
  viewportW: number;
  // 滚动条宽度
  scrollBarW: number;
  // 内容固定宽度
  fixedW = 1200;
  // 负边距百分比
  mPercent: string = '';



  ngOnInit() {
    this.getcourseclassifies();
  }

  // 获取教育云分类
  getcourseclassifies() {
    // 分类 0 为无效 1 为有效
    this.courseService.geteducourseclassifies().subscribe((listRes: any) => {
      this.dataSet = listRes.body.data;
      // 特殊字段图片展示
      this.getcouserlist();
    });
  }
  // 查询专题分类八条数据
  getcouserlist() {
    if (this.dataSet !== undefined && this.dataSet != null) {
      const copyParams = {};
      for (let i = 0; i < this.dataSet.length; i++) {
        copyParams['classifyId'] = this.dataSet[i].id;
        this.courseService.geteducoursestop8(copyParams).subscribe((subres: any) => {
          this.ItemTypeListArray[i] = subres.body.data;
        });
      }
    }
  }

  ngAfterContentInit() {
    this.computePercent();
    window.onresize = () => {
      this.computePercent();
    };
  }

  ngAfterContentChecked(): void {
    // 文档宽度(不包括滚动条：在1920设备屏幕下，页面没渲染前为1920，渲染后为1914)
    const clientW = document.documentElement.clientWidth;
    if (!this.scrollBarW && clientW < this.viewportW) {
      // 动态获取浏览器滚动条宽度
      this.scrollBarW = this.viewportW - clientW;
    }
  }

  computePercent() {
    this.viewportW = window.innerWidth;
    this.mPercent = (this.viewportW - this.fixedW) * 100 / 2 / 1200 + '%';
  }

  getStyle() {
    if (this.viewportW > 1200) {
      return {
        // 右边距需减除滚动条宽度
        'margin': `0 calc(-${this.mPercent} + ${this.scrollBarW}px) 0 -${this.mPercent}`
      };
    } else {
      return {}
    }
  }
}
