import { Component } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { OnInit, ViewChild } from '@angular/core';
import { SimpleTableComponent, SimpleTableData, SimpleTableColumn} from '@delon/abc';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ClassService } from './class.service';
import { Class } from './class.model';
import { APP_PERMISSIONS } from '@shared/app.permissions';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-course-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.less']
})
export class CourseClassComponent implements OnInit {

  currentPageIndex = 3;

  public page = 0;
  public size = 10;
  public total: number;
  public APP_PERMISSIONS = APP_PERMISSIONS;
  dataList: any[] = [];
  public totalCallNo = 0;
  public selectedRows: SimpleTableData[] = [];
  allChecked = false;
  indeterminate = false;
   // 课程id
  courseId = '';
  // 分类id
  classifyId = '' ;
  // 课程类型id
  courseTypeId = '';
  // HTML模板里面<simple-table>的选择器必须为st
  @ViewChild('st') st: SimpleTableComponent;

  queryParams = {
    // sort固定
     sort: ['order_num,asc']
  };


  constructor(
    private router: Router,
    public msg: NzMessageService,
    public http: _HttpClient,
    public modal: ModalHelper,
    public modalService: NzModalService,
    public classService: ClassService,
    private routeInfo: ActivatedRoute
  ) {
    this.courseId = this.routeInfo.snapshot.queryParams['id'];
    this.classifyId = this.routeInfo.snapshot.queryParams['classifyId'];
    this.courseTypeId = this.routeInfo.snapshot.queryParams['courseTypeId'];
  }

  ngOnInit() {
    this.getDataList();
  }

   changePage(index: number) {
    this.currentPageIndex = index;
  }


  /**
  * 获取数据列表
  * @param {string} url
  */
  public getDataList(isReset?: boolean) {
    const copyParams = {};
    const q = this.queryParams;
    if (isReset === true) {
      this.page = 0;
      Object.keys(q).forEach(function (key) {
        q[key] = '';
      });
    } else {
      Object.keys(q).forEach(function (key) {
        if (q[key] !== '' &&　q[key] !== null) {
          copyParams[key] = q[key];
        }
      });
    }
    copyParams['page'] = this.page;
    copyParams['size'] = this.size;
   this.classService.queryClass(this.courseId, copyParams)
      .subscribe((res: any) => {
        console.log(res);
      this.dataList = res.body.data;
      this.total = res.headers.get('X-Total-Count');
      });
  }

  // /**
  // * 页码数量变动事件
  // * @param
  // */
  // paginationChange(event) {
  //   // this.page = event.pi - 1;
  //   this.page = 0;
  //   this.size = event.ps;
  //   this.getDataList();
  // }

 /**
  * 页码变动事件
  * @param
  */
  changePageIndex(pageIndex ) {
    this.page = pageIndex - 1;
     this.getDataList();
  }


  // /**
  // * 过滤器变动事件 支持多选过滤
  // * @param
  // */
  // filterChange(event) {
  //   let i = 0;
  //   let _value = [];
  //   let _type = event.filterMultiple ? 'in' : 'equals';
  //   event.filters.forEach(element => {
  //     if (element.checked) {
  //       _value[i++] = element.value;
  //     }
  //   });
  //   this.queryParams[event.indexKey +'.'+ _type] = _value;
  //   this.getDataList();
  // }

  /**
  * 排序变动事件
  * @param
  */
  // sortChange(event) {
  //   const array = this.queryParams['sort'];
  //   const length = array.length;
  //   let isInArray = false;
  //   let value = null;
  //   if (event.value === 'descend') {
  //     value = 'desc';
  //   } else if (event.value === 'ascend') {
  //     value = 'asc';
  //   }
  //   for (let i = 0; i < length; i++) {
  //     if (array[i].startsWith(event.column.indexKey)) {
  //       if (value == null) {
  //         array.splice(i, 1);
  //         isInArray = true;
  //         break;
  //       } else {
  //         array[i] = event.column.indexKey + "," + value;
  //         isInArray = true;
  //         break;
  //       }
  //     }
  //   }
  //   if (value != null && !isInArray) {
  //     array.push(event.column.indexKey + "," + value);
  //   }
  //   // 排序改变时，simpleTable会重置页码
  //   this.page = 0;
  //   this.getDataList();
  // }


  formatIsOk (item: any) {
    if (item.isOk && item.isOk === '1') {
      item.isOk = true;
    } else if (item.isOk && item.isOk === '0') {
      item.isOk = false;
    }
    return item;
  }


  backPage() {
    this.router.navigateByUrl('/admin/teacher');
  }



refreshStatus(): void {
  const validData = this.dataList.filter(value => !value.disabled);
  const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
  const allUnChecked = validData.every(value => !value.checked);
  this.allChecked = allChecked;
  this.indeterminate = (!allChecked) && (!allUnChecked);
}

goback() {
}

}
