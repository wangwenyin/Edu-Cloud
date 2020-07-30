import { Component, OnInit, Inject } from '@angular/core';
import { LearnService } from '../learn.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-evaluate-modal',
  templateUrl: './evaluate-modal.component.html',
  styleUrls: ['./evaluate-modal.component.less']
})
export class EvaluateModalComponent implements OnInit {
  record: any = {};
  courseName = '';
  form: FormGroup;
  courseId: string;
  personid = '';
  personName = '';
  submitting = false;
  constructor(
    private fb: FormBuilder,
    public msg: NzMessageService,
    private modal: NzModalRef,
    private routerInfo: ActivatedRoute,
    private learnService: LearnService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.form = this.fb.group({
      appraiseContent: [null], // 评价内容
      appraiseGrade: [null], // 评价等级
    });
  }

  ngOnInit() {
    this.courseId = this.routerInfo.snapshot.queryParams['courseId'];
    this.personName = this.tokenService.get().entity_name; // 登录人
    this.personid = this.tokenService.get().entity_id; // 登录id
    console.log(this.courseId, 'this.courseId');
     console.log(this.personName, 'this.personName');
     console.log(this.personid, 'this.personid');
  }
  // 提交
  _submit() {
    this.record['eduCourseId'] = this.courseId;
    this.record['eduStudentId'] =  this.personid;
    this.record['courseName'] =  this.courseName;
    this.record['appraiseTime'] = new Date();
    this.record = Object.assign(this.record, this.form.value);
    this.submitting = true;
    this.learnService.getevaluationlist(this.record).subscribe((resp) => {
      if (resp.body && resp.body.id !== null) {
        this.msg.info('添加成功');
        this._close(true);
      } else {
        this.msg.info('添加失败');
        this._close(false);
      }
      this.submitting = false;
    });
  }
   /**
   * 组件关闭
   * @param refresh
   */
  _close(refresh: boolean) {
     this.modal.destroy(refresh);
  }
}
