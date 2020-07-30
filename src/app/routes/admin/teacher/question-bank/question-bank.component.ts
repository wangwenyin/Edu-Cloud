import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode, NzMessageService, NzModalService, UploadFile, NzTreeComponent } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { CourseService } from 'app/routes/course/course.service';
import { QuestionBankService } from './question-bank.service';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ModalHelper } from '@delon/theme';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.less']
})
export class QuestionBankComponent implements OnInit {

  page = 1 ;
  size = 10 ;
  total = '0';
  eventIns: NzFormatEmitEvent;

  @ViewChild('nzTree') nzTree: NzTreeComponent;

  @Input() isRecovery = false;

  // 批量设置弹框显示
  isVisible = false;
  // 批量设置复选框默认设置
  batchChecked = true;
  // 上传 弹框显示
  uploadIsVisible = false;
  // 导入题目 excel
  excelFile: UploadFile[] = [];
  // 是否上传中
  excelUploading = false;
  // 是否导出中
  excelExporting = false;
  // 选中课时
  selectCatalog: any;
  // 导入接口
  importUrl = '';
  // 导出弹框显示
  exportIsVisible = false;
  // 选中list
  selectedNodeList: NzTreeNode[]	 = [];
  // 下载地址
  downloadURL = '';

  flag = false;

  allChecked = false;
  indeterminate = true;
  questionCourse = '';
  checkOptionsOne = [];
  selectedDatas = [];

  parentNode = [];
  teacherId = '';
  questionList = [];
  questionOption = [];
  constructor(
    private modalHelper: ModalHelper,
    private modalService: NzModalService,
    private courseService: CourseService,
    private httpAddressService: HttpAddressService,
    private elementRef: ElementRef,
    private http: HttpClient,
    private questionBankService: QuestionBankService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public msg: NzMessageService,
    ) {
      this.teacherId = this.tokenService.get().entity_id;
      this.importUrl = httpAddressService.apiGateway + httpAddressService.EduServe + '/edu-subjects/import';
      this.downloadURL = this.httpAddressService.apiGateway + this.httpAddressService.EduServe + '/edu-subjects/export';
    }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadCourse();
  }

  loadCourse() {
    const param = {
      'teacherId.equals': this.teacherId,
      'isDelete.equals': '0',
      'isPublish.equals': '1',
      'sort': ['orderNum,asc']
    };
    this.courseService.query(param).subscribe(res => {
      if (res && res.body && res.body != null) {
        const records = res.body;
        for (let i = 0; i < records.length; i++) {
          this.parentNode.push(new NzTreeNode({
            title   : records[i].courseName,
            key     : records[i].id,
            origin  : records[i]
          }));
        }
      }
    });
  }

  expandAction(e: NzFormatEmitEvent): void {
    if (e.node.getChildren().length === 0 && e.node.isExpanded) {
      const param = {
        'eduCourseId.equals': e.node.key,
        'isOk.equals': '1',
        'isAudit.equals': '1',
        'sort': ['orderNum,asc']
      };
      this.questionBankService.queryCourseCatalogs(param).subscribe((res: any) => {
        if (res && res.body && res.body !== null) {
          const records = res.body;
          for (let i = 0; i < records.length; i++) {
            e.node.children.push(new NzTreeNode({
              title   : records[i].name,
              key     : records[i].id,
              isLeaf  : true,
              origin  : records[i]
            }));
          }
          e.node.isLoading = false;
        }
      });
    }
  }


  loadQuestionList(e: NzFormatEmitEvent): void {
    this.selectCatalog = e.node.origin.origin;
    if (e.node.isLeaf === true) {
      this.msg.remove();
      this.msg.loading('加载中');
      this.eventIns = e;
      const param = {
        'eduCatalogId.equals': e.node.key,
        'isDelete.equals': '0',
        'page' : this.page - 1,
        'size' : this.size,
        'sort': ['orderNum,asc']
      };

      if (this.isRecovery) {
        param['isDelete.equals'] = '2';
      }

      this.questionBankService.querySubject(param).subscribe(res => {
        this.msg.remove();
        if (res && res.body && res.body !== null && res.body.length > 0) {
          this.total = res.headers.get('X-Total-Count');
          const records = res.body;
          this.questionList = records;
          this.questionCourse = e.node.title;
          for (let i = 0; i < records.length; i++) {
            records[i].num = (this.page - 1) * this.size + i + 1;
            records[i].options = records[i].optionDTOs;
            records[i].checked = false;
          }
        } else {
          this.questionList = [];
        }
      });
    } else {
      e.node.isExpanded = !e.node.isExpanded;
      if (e.node.isExpanded === true && e.node.children.length === 0) {
        e.node.isLoading = !e.node.isLoading;
      }
      this.expandAction(e);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.questionList.forEach(item => item.checked = true);
    } else {
      this.questionList.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(): void {
    if (this.questionList.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.questionList.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  openEditQuestionModal() {
    let questionId = '';
    this.selectedDatas = this.questionList.filter(v => v.checked);
    if (this.selectedDatas.length === 1) {
      questionId = this.selectedDatas[0].id;
      this.modalHelper.static(AddQuestionComponent, { isAdd: false , questionId: questionId},
                            680, { nzClassName: 'question-modal' }).subscribe(() => {
                              this.questionList = [];
                              this.pageIndexChange(this.page);
                            });
    } else {
      this.msg.info('请选择一条数据');
    }
  }

  // 删除
  deleteQuestion(index: string) {
    let questionId = '';
    this.selectedDatas = this.questionList.filter(v => v.checked);
    if (this.selectedDatas.length > 0) {
      this.modalService.confirm({
        nzTitle: index === '0' ? '恢复题目' : '删除题目',
        nzContent: index === '0' ? '您将要恢复选中题目' : '您将要删除选中题目',
        nzOkText: '确认',
        nzCancelText: '取消',
        nzOnOk: () => {
          questionId = this.selectedDatas[0].id;
          let ids = '';
          ids = ids + this.selectedDatas.map(value => value.id) + ',';
          this.delete(index, ids);
          // this.questionBankService.deleteQuestionInfo(ids).subscribe((res: any) => {
          //   this.msg.info('删除成功');
          //   this.pageIndexChange(this.page);
          // });
        }
      });
    } else {
      this.msg.info('请选择一条数据');
    }
  }


  // 删除与恢复操作
  delete(index: string, ids: string) {
    if (index === '1') {
      this.questionBankService.deleteQuestionInfo(ids).subscribe((res: any) => {
        this.msg.info('删除成功');
        this.pageIndexChange(this.page);
      });
      return;
    }

    if (index === '2') {
      this.questionBankService.recycleQuestionInfo(ids).subscribe((res: any) => {
        this.msg.info('移入回收站成功');
        this.pageIndexChange(this.page);
      });
      return;
    }

    if (index === '0') {
      this.questionBankService.recoveryQuestionInfo(ids).subscribe((res: any) => {
        this.msg.info('恢复成功');
        this.pageIndexChange(this.page);
      });
      return;
    }
  }

  // 批量设置操作
  batchSetIsAllowExtract() {
      if (0 === this.checkSelectData()) {
        return;
      }
      let ids = '';
      ids = ids + this.selectedDatas.map(value => value.id) + ',';
     this.questionBankService.modifyIsAllowExtract(this.batchChecked + '', ids).subscribe(res => {
       const result = res.body;
      if (result.success === true) {
        this.msg.remove();
        this.msg.info('批量设置成功');
        this.handleCancel();
      } else {
        this.msg.error(result.message);
      }
      this.pageIndexChange(this.page);
     });
    }

  // 上传之前
  beforeUpload = (file: UploadFile): boolean => {
    this.excelFile.push(file);
    return false;
  }

  // 导入题目逻辑
  handleUpload(): void {
      if (!this.selectCatalog) {
        this.msg.warning('请选中课时后再执行导入');
        return;
      }
      const formData = new FormData();
      this.excelFile.forEach((file: any) => {
        formData.append('file', file);
      });
      formData.append('eduCourseId', this.selectCatalog.eduCourseId);
      formData.append('eduCatalogId', this.selectCatalog.id);
      this.excelUploading = true;
      const req = new HttpRequest('POST', this.importUrl, formData, {});
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          (event: any) => {
            const result = event.body;
            this.excelUploading = false;
            if (result.success === false) {
              this.msg.error(result.message);
            } else {
              this.msg.success('导入成功');
              this.handleCancel();
              this.excelFile = [];
              this.pageIndexChange(this.page);
            }
          },
          err => {
            this.excelUploading = false;
            this.msg.error('upload failed.');
          }
        );
  }

  // 导出题目
  export() {
    // 先判断是否有勾选
    this.selectedDatas = this.questionList.filter(v => v.checked);
    let ids = '';
    if (this.selectedDatas.length > 0){
      // 只导出勾选的数据
      ids = this.selectedDatas.map(v => v.id).join(',');
      this.exportOper(ids , '0');
    } else {
      const reconds = this.nzTree.getSelectedNodeList();
      if (reconds.length > 0) {
        ids = reconds[0].origin.origin.id;
        // 导出课时题目
        if (reconds[0].isLeaf) {
          this.exportOper(ids , '1');
        } else {
          // 导出课程题目
          this.exportOper(ids , '2');
        }
      } else {
        this.msg.warning('选择导出数据后才能导出');
        return;
      }
    }
  }

  // 导出操作
  exportOper(ids: string, type: string) {
    this.excelExporting = true;
    const token = this.tokenService.get().token;
    const requestBody = {};
    const url = this.downloadURL + '/' + type + '/' + ids;
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'blob';

    xhr.onprogress = function (event) {
      if (event.lengthComputable) {
        const progress = Number((event.loaded * 100 / event.total).toString().split('.')[0]);
        console.log(progress);
      }
    };

    xhr.onload = function (e) {
      if (this.status === 200) {
        const blob = xhr.response;
        const link = document.createElement('a');
        const val = URL.createObjectURL(blob);
        link.href = val;
        link.download =  '题库导出.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
      }
    };
    xhr.send(JSON.stringify(requestBody));


    // this.questionBankService.export(type, ids).subscribe(() => {
    //   const tmp = this.elementRef.nativeElement.querySelector('#download');
    //   // let content = res.response;
    //   // let blob = new Blob([content]);
    
    //   // tmp.href = URL.createObjectURL(res.body);

    //   // tmp.href = this.downloadURL + '/' + type + '/' + ids;
    // tmp.click();
     
    // });

    setTimeout(() => {
      this.excelExporting = false;
    }, 2000);
  }


  /**a
  * 页码数量变动事件
  * @param
  */
  pageIndexChange(event: number) {
    // this.page = event;
    this.loadQuestionList(this.eventIns);
  }


  pageSizeChange(event: number) {
    this.size = event;
    this.loadQuestionList(this.eventIns);
  }

  openAddQuestionModal() {
    const param = {
      isAdd: true
    };
    if (this.selectCatalog) {
      param['courseId'] = this.selectCatalog.eduCourseId;
      param['catalogId'] = this.selectCatalog.id;
    }
    this.modalHelper.static(AddQuestionComponent, param, 680, { nzClassName: 'question-modal' }).subscribe(() => {
      this.questionList = [];
      this.pageIndexChange(this.page);
    });
  }

  // 打开导出弹框
  openExportModal() {
    this.exportIsVisible = true;
  }

  // 打开批量设置弹框
  openUploadnModal() {
      this.uploadIsVisible = true;
   }

  // 打开批量设置弹框
  openBatchSet() {
    this.isVisible = true;
  }

  // 关闭批量设置弹框
  handleCancel() {
    this.isVisible = false;
    this.uploadIsVisible = false;
    this.exportIsVisible = false;
  }

  handleOk() {
    this.batchSetIsAllowExtract();
  }


  // 统一校验
  checkSelectData(): number {
    this.selectedDatas = this.questionList.filter(v => v.checked);
    if (this.selectedDatas.length === 0) {
      this.msg.error('请选中数据后操作');
      return 0;
    } else if (this.selectedDatas.length === 0) {
      return 1;
    } else {
      return 2;
    }
  }
}
