/**
 * 省市院校三级联动组件
 * @author xq
 * @since 2020-03-03
 * @description 省市院校三级联动组件
 */
// tslint:disable:no-any
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SchoolService } from './school.service';
import { School } from './school.model';
import { CacheService } from '@delon/cache';


let provinces: any;
let cities: any;
let colleges: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ths-colleges-select',
  templateUrl: './provincesColleges.component.html',
  styles: [
    `
      .ant-cascader-picker {
        width: 300px;
      }
    `
  ]
})



export class ThsCollegesSelectComponent implements OnInit {

    /**
     * 是否必选 -- 显示红色标识
     */
    @Input() isRequired = false;

    /**
     * 是否 显示lable
     */
    @Input() isShowLable = true;

    /**
     * 初始化显示   ids为school表中id  数组   ['1', '32', '35']  ['35']
     */
    @Input() ids = [];

    /**
     * 初始化显示   names为school表中name  数组   ['湖北', '武汉', '武汉大学']  ['35']
     */
    @Input() names = [];

    /**
     * 提示文本
     */
    @Input() nzPlaceHolder = '请选择院校';

     /**
     * label 宽度
     */
    @Input() nzLabelSpan = 4;

     /**
     *  input宽度
     */
    @Input() nzInputSpan = 8;

    /**
     * 完成选中回调事件
     */
    @Output() selectFinish: EventEmitter<{}> = new EventEmitter<{}>();


  values: any[] | null;
  validateForm: FormGroup;
  options: any;
  selectData = {
    province : new School,
    city : new School,
    college : new School
  };

  queryParams = {
    'level.equals': '1',
    'isOk.equals': '1',
    'sort': ['orderNum,asc'],
 //   'sort': ['orderNum,asc']
  };


  constructor(
    private schoolService: SchoolService,
    public msg: NzMessageService,
    private cacheService: CacheService,
    private fb: FormBuilder
) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      schoolId: [null],
    });
    this.loadInitData();
    this.loadOptions();
  }


  loadInitData() {
    if (this.ids.length > 0) {
      const queryParams = {
        'id.in' : this.ids,
        'isOk.equals': '1',
      };
      this.schoolService.query(queryParams).subscribe(res => {
        if (res.body && res.body.length) {
           const value = [];
            for (let i = 0 ; i <  res.body.length; i++) {
              value[i] =  res.body[i].name;
            }
            this.values = value;
        }
      });
    } else if (this.names.length > 0) {
      this.values = this.names;
      // const queryParams = {
      //   'name.in' : this.names,
      //   'sort': ['level,asc'],
      //   'isOk.equals': '1',
      // };
      // this.schoolService.query(queryParams).subscribe(res => {
      //   if (res.body && res.body.length) {
      //      const value = [];
      //       for (let i = 0 ; i <  res.body.length; i++) {
      //         value[i] =  res.body[i].name;
      //       }
      //       this.values = value;
      //       this.selectFinish.emit(res.body);
      //   }
      // });
    }
  }

  loadOptions() {
    this.options = this.cacheService.getNone('schoolTree');
     if (!this.options || this.options === null) {
      this.schoolService.queryTree().subscribe(res => {
          this.options = res;
          this.cacheService.set('schoolTree', this.options);
      });
     }
  }


  // loadCitiesOrColleges(id: any, level: any) {
  //   const queryParams = {
  //     'parentId.equals': id,
  //     'isOk.equals': '1',
  //     'sort': ['orderNum,asc'],
  //   };

  //   this.schoolService.query(queryParams).subscribe(res => {
  //     if (res.body && res.body.length) {
  //       if (level === 1) {
  //         cities = this.cacheService.getNone('cities');
  //         if (!cities || cities === null) {
  //            cities = res.body;
  //           for (let i = 0 ; i <  res.body.length; i++) {
  //             cities[i].label =  res.body[i].name;
  //             cities[i].value =  res.body[i].id;
  //           }
  //           this.cacheService.set('cities', cities);
  //         }
  //       } else {
  //         colleges = this.cacheService.getNone('colleges');
  //         if (!colleges || colleges === null) {
  //           colleges = res.body;
  //           for (let i = 0 ; i < res.body.length; i++) {
  //             colleges[i].label =  res.body[i].name;
  //             colleges[i].value =  res.body[i].id;
  //             colleges[i].isLeaf =  true;
  //           }
  //           this.cacheService.set('colleges', colleges);
  //         }

  //       }
  //     }
  //   });
  // }



  onSelect(item: any) {
    if ( item.option.level === '3') {
      this.getResultValue(this.selectData.college, item.option);
      return;
    }
    if (item.option.level === '2') {
      // colleges = [];
      this.getResultValue(this.selectData.city, item.option);
    }
    if (item.option.level === '1') {
      // cities = [];
      this.getResultValue(this.selectData.province, item.option);
    }
    // this.loadCitiesOrColleges(item.option.id, item.option.level);
  }

  getResultValue(result: School, item: any) {
    result.id = item.value;
    result.name = item.label;
    result.level = item.level;
    result.parentId = item.parent;
    result.remark = item.remark;
  }

  onChanges(values: any): void {
    this.selectFinish.emit(this.selectData);
  }

  // /** load data async execute by `nzLoadData` method */
  // loadData(node: any, index: number): PromiseLike<any> {
  //   return new Promise(resolve => {
  //     if (!provinces || provinces === null || !cities || cities === null || !colleges || colleges === null) {
  //       setTimeout(() => {
  //         if (index < 0) {
  //            node.children = provinces;
  //         } else if (index === 0) {
  //             node.children = cities;
  //         } else {
  //           node.children = colleges;
  //         }
  //         resolve();
  //       }, 900);
  //     } else {
  //       setTimeout(() => {
  //         if (index < 0) {
  //            node.children = provinces;
  //         } else if (index === 0) {
  //             node.children = cities;
  //         } else {
  //           node.children = colleges;
  //         }
  //         resolve();
  //       }, 0);
  //     }
  //   });
  // }
}
