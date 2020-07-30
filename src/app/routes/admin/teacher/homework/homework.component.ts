import { Component, OnInit, Inject } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { AddWorkComponent } from './add-work/add-work.component';
import {PriviewWorkComponent  } from './homeworkPreview/priview-work.component';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HomeworkService } from './homework.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.less']
})
export class HomeworkComponent implements OnInit {
  dataSet = [];
  allChecked = false;
  indeterminate = false;
  public page = 1;
  public size = 10;
  teacherId = '';
  public total: number;
  setOfCheckedId = new Set<string>();
  constructor(
    private modalHelper: ModalHelper,
    private homeworkService: HomeworkService,
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
      this.teacherId = this.tokenService.get().entity_id;
    }

  ngOnInit() {
    this.getDataList();
  }

  public getDataList() {
    const copyParams = {};
    copyParams['page'] = this.page - 1;
    copyParams['size'] = this.size;
   this.homeworkService.queryHomeworkInfo(this.teacherId, copyParams)
      .subscribe((res: any) => {
      this.dataSet = res.body.data;
     this.total = res.headers.get('X-Total-Count');
      });
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
  }

  openAddWorkModal() {
    this.modalHelper.open(AddWorkComponent, { isAdd: true }, 680, { nzClassName: 'roll-modal' }).subscribe(res => {
      if (res) {
       this.getDataList();
       this.setOfCheckedId = new Set<string>();
      }
    });
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  editWorkModal() {
    let homeworkId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
        homeworkId = element;
      });

      this.modalHelper.open(AddWorkComponent, { isAdd: false , homeworkId: homeworkId},
        680, { nzClassName: 'roll-modal' }).subscribe(res => {
          if (res) {
            this.getDataList();
            this.setOfCheckedId = new Set<string>();
          }
        });
    } else {
      this.msg.info('请选择一条数据');
    }

  }

  public deleteHomework() {
    let homeworkId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
        homeworkId = element;
      });
    this.setOfCheckedId.delete(homeworkId);
     if ('' !== homeworkId) {
        this.homeworkService.deleteHomeworkInfo(homeworkId).subscribe((res: any) => {
          this.msg.info('删除成功');
          this.getDataList();
        });
     }
    } else {
      this.msg.info('请选择一条数据');
    }
  }



  priviewWorkModal() {
    let homeworkId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
        homeworkId = element;
      });

      this.modalHelper.open(PriviewWorkComponent, {  homeworkId: homeworkId},
        680, { nzClassName: 'exam-modal' }).subscribe(res => {
          if (res) {
           // this.getDataList();
          }
        });
    } else {
      this.msg.info('请选择一条数据');
    }

  }

  pageIndexChange() {
    this.setOfCheckedId = new Set<string>();
    this.getDataList();
  }

}
