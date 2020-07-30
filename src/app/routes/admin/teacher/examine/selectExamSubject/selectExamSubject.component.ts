import { Component, OnInit, Inject } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ExamineService } from '../examine.service';
import { NzModalRef } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
@Component({
  // tslint:disable-next-line:component-selector
  selector:  'app-selectExamSubject',
  templateUrl: './selectExamSubject.component.html',
  styleUrls: ['../examine.component.less']
})
export class SelectExamSubjectComponent implements OnInit {

  dataSet = [];
  allChecked = false;
  indeterminate = false;

  public subjectType: string; // 题目类型
  public subjectQuantity: number; // 题目数量
  public courseId: string; // 课程id
  public catalogId: string; // 章节id
  public selIds: string; // 选中的id
  public ids: string; // 自动选择选中的id


  public total: number;
  public selTotal = 0 ;
  constructor(
    private modalHelper: ModalHelper,
    private examineService: ExamineService,
    private nzModalRef: NzModalRef ,
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    }

  ngOnInit() {
    this.getDataList();
  }

  public getDataList() {
    const copyParams = {};
    copyParams['subjectType'] = this.subjectType;
    copyParams['courseId'] = this.courseId;
    copyParams['ids'] = this.ids;
   this.examineService.querySubject(copyParams)
      .subscribe((res: any) => {
      this.dataSet = res.body;
      this.checkById();
      });
  }

   checkById() {
    this.dataSet.forEach(data => {
         if (this.selIds.indexOf(data.id) !== -1) {
          data.checked = true;
         }
    } );
    this.refreshStatus();
   }



  checkAll(value: boolean): void {
    this.dataSet.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.selTotal = this.dataSet.filter(value => value.checked).length;
  }

confirm() {
  const validData = this.dataSet.filter(value => value.checked === true);
  if (validData.length !== this.subjectQuantity ) {
    this.msg.info('选择题目数与设置题目数不一致，请修改');
  } else {
    const subjedtId = [];
    validData.forEach(element => {
       subjedtId.push(element.id);
     });

   const subjedtIdStr = subjedtId.join(',');
  const ret = {
    'subjectId' : subjedtIdStr,
    'subjectType': this.subjectType
  };
    this.nzModalRef.destroy(ret);
  }
    // this.nzModalRef.destroy('123123');
 }


}
