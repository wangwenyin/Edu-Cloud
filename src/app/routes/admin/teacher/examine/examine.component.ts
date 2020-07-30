import { Component, OnInit, Inject } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AddExamComponent } from './add-exam/add-exam.component';
import { NzMessageService } from 'ng-zorro-antd';
import { ExamineService } from './examine.service';
import { PriviewExamComponent } from './examPreview/priview-exam.component';
@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.less']
})
export class ExamineComponent implements OnInit {

  dataSet:  any[] = [];
  allChecked = false;
  indeterminate = false;
  public page = 1;
  public size = 10;
  public total: number;
  teacherId = '';
  setOfCheckedId = new Set<string>();
  constructor(
    private modalHelper: ModalHelper,
    public examineService: ExamineService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public msg: NzMessageService,
    ) {
      this.teacherId = this.tokenService.get().entity_id;
    }

  ngOnInit() {
    this.getDataList();
  }

  checkAll(value: boolean): void {
    this.dataSet.forEach(data => data.checked = value);
    this.dataSet.forEach(data => this.updateCheckedSet(data.id, value));
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
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

  openAddAxamModal() {
    this.modalHelper.open(AddExamComponent, { isAdd: true }, 680, { nzClassName: 'exam-modal' }).subscribe(() => {
      this.getDataList();
      this.setOfCheckedId = new Set<string>();
    });
  }
  openEditExamModal() {
    let examId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
      examId = element;
      });

      this.modalHelper.open(AddExamComponent, { isAdd: false , examId: examId}, 680, { nzClassName: 'exam-modal' }).subscribe(res => {
        if (res) {
          this.getDataList();
          this.setOfCheckedId = new Set<string>();
        }
      });
    } else {
      this.msg.info('请选择一条数据');
    }

  }

  public getDataList() {
    const copyParams = {};
    copyParams['page'] = this.page - 1;
    copyParams['size'] = this.size;
   this.examineService.queryExamInfo(this.teacherId, copyParams)
      .subscribe((res: any) => {
       this.dataSet = res.body.data;
      this.total = res.headers.get('X-Total-Count');
      });
  }


  public deletExam() {
    let examId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
      examId = element;
      });
      this.setOfCheckedId.delete(examId);
     if ('' !== examId) {
        this.examineService.deleteExamInfo(examId).subscribe((res: any) => {
          this.msg.info('删除成功');
          this.getDataList();
        });
     }
    } else {
      this.msg.info('请选择一条数据');
    }
  }

  priviewExamModal() {
    let examId = '';
    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(function (element) {
        examId = element;
      });

      this.modalHelper.open(PriviewExamComponent, {  examId: examId},
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
