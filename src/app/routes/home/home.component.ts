import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HomeService } from './home.service';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  params = {};
  dataSet: any[] = [];
  bannerset = [];
  imagePrefix = '';
  personAvatarSRC = {};
  ItemTypeListArray: any[] = [];
  constructor(
    public msg: NzMessageService,
    private homeService: HomeService,
    private httpAddressService: HttpAddressService,
  ) {
    this.imagePrefix = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files/download/';
   }

  featureCourseList = [
    { title: 'BIM', desc: '建筑信息模型是建筑学、工程学及土木工程的新工具。建筑信息模型或建筑资讯模型一词由Autodesk所创的。', src: '/assets/images/u36.jpg' },
    { title: '施工', desc: '施工，谓工程按计划进行建造。语出宋 朱熹 《西原崔嘉彦书》：“向说栽竹木处，恐亦可便令施工也。', src: '/assets/images/u36.jpg' },
    { title: '造价', desc: '建筑信息模型是建筑学、工程学及土木工程的新工具。建筑信息模型或建筑资讯模型一词由Autodesk所创的。', src: '/assets/images/u36.jpg' },
    { title: '项目管理', desc: '施工，谓工程按计划进行建造。语出宋 朱熹 《西原崔嘉彦书》：“向说栽竹木处，恐亦可便令施工也。', src: '/assets/images/u36.jpg' }
  ];

  teachingCourseList = [
    { title: '本科教学课程', desc: '建筑信息模型是建筑学、工程学及土木工程的新工具。建筑信息模型或建筑资讯模型一词由Autodesk所创的。', src: '/assets/images/u36.jpg' },
    { title: '高职教学课程', desc: '施工，谓工程按计划进行建造。语出宋 朱熹 《西原崔嘉彦书》：“向说栽竹木处，恐亦可便令施工也。', src: '/assets/images/u36.jpg' },
  ];

  certificationList = [
    { title: '1+X认证', desc: '建筑信息模型是建筑学、工程学及土木工程的新工具。建筑信息模型或建筑资讯模型一词由Autodesk所创的。', src: '/assets/images/u36.jpg' },
    { title: '全国BIM应用技能认证', desc: '施工，谓工程按计划进行建造。语出宋 朱熹 《西原崔嘉彦书》：“向说栽竹木处，恐亦可便令施工也。', src: '/assets/images/u36.jpg' },
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
    // 页面初始化 加载数据
    this.getCourseClassifies();
  }

  // 获取教育云分类
  getCourseClassifies () {
    // 分类 0 为无效 1 为有效
    this.homeService.geteducourseclassifies().subscribe((listRes: any) => {
      this.dataSet = listRes.body.data;
      this.getCouserList();
    });
  }
  // 查询专题分类四条数据
  getCouserList() {
    if (this.dataSet !== undefined && this.dataSet != null) {
      const copyParams = {};
          for (let i = 0; i < this.dataSet.length; i++) {
            copyParams['classifyId'] = this.dataSet[i].id;
            this.homeService.geteducoursestop4(copyParams).subscribe((subres: any) => {
                 this.ItemTypeListArray[i] = subres.body.data;
               });
          }
    }
  }
  // tslint:disable-next-line: use-life-cycle-interface
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
