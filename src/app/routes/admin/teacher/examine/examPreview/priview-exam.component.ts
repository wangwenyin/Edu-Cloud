import { Component, OnInit , Inject, Input, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamineService } from '../examine.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { NzModalRef } from 'ng-zorro-antd';
import { HttpAddressService } from '@shared/session/http-address.service';
@Component({
  selector: 'app-priview-exam',
  templateUrl: './priview-exam.component.html',
})
export class PriviewExamComponent implements OnInit {


  // 实体id
  entityId = '';

  public examId: string;
  examDownload = false;
  examTitle = '';
  examTimeLength = '';
  totalScore = '';
  options = '';
  manualTypeDataSet = [
  ];

  typeDataSet = [
  ];

  examType = [];

  examTypeAndOptions = [];
  type0 = []; // 单选题
  type1 = []; // 多选题
  type2 = []; // 判断题



  topicIds = ''; // 题目id
  downloadURL = '';

  constructor(
    private fb: FormBuilder,
    private modalHelper: ModalHelper,
    private examineService: ExamineService,
    private nzModalRef: NzModalRef ,
    public msg: NzMessageService,
    private elementRef: ElementRef,
    private httpAddressService: HttpAddressService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    this.entityId = tokenService.get().entity_id;
    this.downloadURL = this.httpAddressService.apiGateway + this.httpAddressService.EduServe + '/edu-exams';
  }

  ngOnInit() {
      this.loadData();
      this.getExamType();
  }

  loadData(): void {
    this.examineService.find(this.examId).subscribe((res: any) => {
      const record = res.body;
      this.msg.remove();
      if (record && record !== null) {
        const val = record;
        console.log(val);
        this.examTitle = val.examTitle;
        this.examTimeLength = val.examTimeLength;
        this.totalScore = val.totalScore;
      }
    });
  }

// 获取试卷类型
getExamType() {
  this.examineService.queryTypeAndTopic(this.examId).subscribe(res => {
    const reconds = res.body;
    console.log(res);
     if (reconds && reconds !== null && reconds.length > 0) {
      this.examType = reconds;
      this.examType.forEach(element => {
        const subject_type = element.subject_type;
       /*   */
            this.options = '';
        if ('0' === subject_type) {
          this.options = element.subject_options;
           const subjectOption = this.options.split('#');
           const t = {id: element.id, 'subject_type': element.subject_type, 'score': element.score,
          'subject_title': element.subject_title, 'subject_options': subjectOption};
           this.type0.push(t);
        } else if ('1' === subject_type) {
          this.options = element.subject_options;
           const subjectOption = this.options.split('#');
           const t = {id: element.id, 'subject_type': element.subject_type, 'score': element.score,
          'subject_title': element.subject_title, 'subject_options': subjectOption};
           this.type1.push(t);
        } else if ('2' === subject_type) {
          this.options = element.subject_options;
           const t = {id: element.id, 'subject_type': element.subject_type, 'score': element.score,
          'subject_title': element.subject_title, 'subject_options': ''};
           this.type2.push(t);
        }
      });
    }
    if (this.type0.length > 0) {
      const htype0 = {'type': '0', 'typedata' : this.type0 };
      this.examTypeAndOptions.push(htype0);
    }
    if (this.type1.length > 0) {
      const htype1 = {'type': '1', 'typedata' : this.type1 };
      this.examTypeAndOptions.push(htype1);
    }
    if (this.type2.length > 0) {
      const htype2 = {'type': '2', 'typedata' : this.type2 };
      this.examTypeAndOptions.push(htype2);
    }
  });
}

public downloadexam() {
    this.examDownload = true;
    const tmp = this.elementRef.nativeElement.querySelector('#download');
    tmp.href = this.downloadURL + '/downloadExam?examId=' + this.examId;
    tmp.click();
    setTimeout(() => {
      this.examDownload = false;
    }, 2000);
  }


}
