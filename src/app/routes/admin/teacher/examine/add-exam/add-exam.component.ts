import { Component, OnInit , Inject, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamineService } from '../examine.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ModalHelper } from '@delon/theme';
import { SelectExamSubjectComponent } from '../selectExamSubject/selectExamSubject.component';
@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.less']
})
export class AddExamComponent implements OnInit {

  isAdd: boolean;

  haveSelected = false;

  loading = false;

  form: FormGroup;
  @Input() examId = '';
  manualTopic = [];
  autoTopic = [];
  // 实体id
  entityId = '';
  courseName = '';
  courseList = [
  ];
  examType = [];
  manualTypeId0 = ''; // 手动单选题选择的题目id
  manualTypeId1 = ''; // 手动多选题选择的题目id
  manualTypeId2 = ''; // 手动判断题选择的题目id

  autoTypeId0 = ''; // 自动单选题选择的题目id
  autoTypeId1 = ''; // 自动多选题选择的题目id
  autoTypeId2 = ''; // 自动判断题选择的题目id
  manualSubList = [  // 手动选择的题目信息
  ];
  autoSubList = [  // 自动选择的题目信息
  ];

  manualTypeDataSet = [
  ];

  autoTypeDataSet = [
  ];


  isSetSubject = true; // 是否设置了题目选项
  countSubjectScore = 0; // 计算总分数
  countSubject = 0; // 计算题目总数
  topicIds = ''; // 题目id

  constructor(
    private fb: FormBuilder,
    public msg: NzMessageService,
    private modalHelper: ModalHelper,
    private nzModalRef: NzModalRef,
    private examineService: ExamineService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
    this.form = this.fb.group({
      eduCourseId: [null, [Validators.required]],
      examTitle: [null, [Validators.required]],
      examTimeLength: [null, [Validators.required]],
      totalScore: [null, [Validators.required]],
      isOk: ['1', [Validators.required]],
      isPublic: ['1', [Validators.required]],
    });
    this.entityId = tokenService.get().entity_id;
  }

  ngOnInit() {
    this.getCourseMsg();
    if (!this.isAdd) {
      this.loadData();
      this.getExamType();
      this.getTopics();
    } else {
      this.manualTypeDataSet = [
        {id: null, subject_type: '0', score: null, quantity: null },
        {id: null, subject_type: '1', score: null, quantity: null  },
        {id: null, subject_type: '2', score: null, quantity: null  },
      ];
      this.autoTypeDataSet = [
        {id: null, subject_type: '0', score: null, quantity: null  },
        {id: null, subject_type: '1', score: null, quantity: null  },
        {id: null, subject_type: '2', score: null, quantity: null  },
      ];
    }
  }

// 获取课程数据
getCourseMsg() {
  this.examineService.queryCourse(this.entityId).subscribe(res => {
    const reconds = res.body;
    if (reconds && reconds !== null && reconds.length > 0) {
      this.courseList = reconds;
    }
  });
}

loadData(): void {
  this.examineService.find(this.examId).subscribe((res: any) => {
    const record = res.body;
   // this.msg.remove();
    if (record && record !== null) {
      const val = record;
      this.form.controls.eduCourseId.setValue(val.eduCourseId);
      this.form.controls.examTitle.setValue(val.examTitle);
      this.form.controls.examTimeLength.setValue(val.examTimeLength);
      this.form.controls.totalScore.setValue(val.totalScore);
      this.form.controls.isOk.setValue(val.isOk);
      this.form.controls.isPublic.setValue(val.isPublic);
    }
  });
}

courseChange(courseId: string) {
   // 将所选题目全部清空
   this.manualTypeId0 = ''; // 手动单选题选择的题目id
   this.manualTypeId1 = ''; // 手动多选题选择的题目id
   this.manualTypeId2 = ''; // 手动判断题选择的题目id
   this. autoTypeId0 = ''; // 自动单选题选择的题目id
   this.autoTypeId1 = ''; // 自动多选题选择的题目id
   this.autoTypeId2 = ''; // 自动判断题选择的题目id
}


// 获取试卷类型
getExamType() {
  this.examineService.queryExamType(this.examId).subscribe(res => {
    const reconds = res.body;
    if (reconds && reconds !== null && reconds.length > 0) {
      this.examType = reconds;
      this.examType.forEach(element => {
        const choose_type = element.choose_type;
        const t = {id: element.id, 'subject_type': element.subject_type, 'score': element.score, 'quantity': element.quantity};
        if ('0' === choose_type) {
         // { subject_type: '0',score:null },
          this.manualTypeDataSet.push(t);
        } else {
          this.autoTypeDataSet.push(t);
        }
      });
    }
  });
}

// 获取选中的题目id
getTopics() {
  this.examineService.queryTopicsByExamId(this.examId).subscribe(res => {
    const reconds = res.body;
     if (reconds && reconds !== null && reconds.length > 0) {
      reconds.forEach(element => {
        console.log('getTopics-element:' + element.choose_type);
        const choose_type = element.choose_type;
        const subject_type = element.subject_type;
        if ('0' === choose_type) {
          if ('0' === subject_type ) {
             this.manualTypeId0 = element.ids;
          } else if ('1' === subject_type ) {
            this.manualTypeId1 = element.ids;
          } else if ('2' === subject_type ) {
            this.manualTypeId2 = element.ids;
          }
        } else if ('1' === choose_type) {
          if ('0' === subject_type ) {
            this.autoTypeId0 = element.ids;
          } else if ('1' === subject_type ) {
            this.autoTypeId1 = element.ids;
          } else if ('2' === subject_type ) {
            this.autoTypeId2 = element.ids;
          }
        }
      });
    }
  });
}


// 手动选题
openSelectSubjectModal(data) {
  const courseId = this.form.controls.eduCourseId.value;
  if ( !courseId) {
    this.msg.info('请先选择课程，再选择题目');
    return ;
  }
  const subjectType = data.subject_type;
  const subjectQuantity = data.quantity;
  const score = data.score;
  if (!(subjectQuantity > 0 && score > 0)) {
    this.msg.info('请先设置分数和题目数量并且大于0，再选择题目');
    return ;
  }

   let ids = null;
   let selIds = null;
   if ('0' === subjectType) {
     selIds = this.manualTypeId0;
     ids = this.autoTypeId0;
   } else if ('1' === subjectType) {
    selIds = this.manualTypeId1;
     ids = this.autoTypeId1;
   } else if ('2' === subjectType) {
    selIds = this.manualTypeId2;
     ids = this.autoTypeId2;
   }

  // 选择题目
   this.modalHelper.open(SelectExamSubjectComponent, { isAdd: true, courseId: courseId, subjectType : subjectType ,
         subjectQuantity : subjectQuantity, ids: ids, selIds: selIds }, 'xl', { nzClassName: 'select-modal' }).subscribe(res => {
           if (!!res) {
           const subjectId = res.subjectId;
            const type = subjectType;
            if ('0' === type) {
              this.manualTypeId0 = subjectId;
            } else if ('1' === type) {
              this.manualTypeId1 = subjectId;
            } else if ('2' === type) {
              this.manualTypeId2 = subjectId;
            }
          }
        });

}

// 自动选题
autoSelectSubjectModal(data) {
  const courseId = this.form.controls.eduCourseId.value;
  if ( !courseId) {
    this.msg.info('请先选择课程，再选择题目');
    return ;
  }
  const subjectType = data.subject_type;
  const subjectQuantity = data.quantity;
  const score = data.score;
  if (!(subjectQuantity > 0 && score > 0)) {
    this.msg.info('请先设置分数和题目数量并且大于0，再选择题目');
    return ;
  }

   let ids = null;
   if ('0' === subjectType) {
     ids = this.manualTypeId0;
   } else if ('1' === subjectType) {
     ids = this.manualTypeId1;
   } else if ('2' === subjectType) {
     ids = this.manualTypeId2;
   }
   const copyParams = {};
   copyParams['subjectType'] = subjectType;
   copyParams['subjectQuantity'] = subjectQuantity;
   copyParams['courseId'] = courseId;
   copyParams['ids'] = ids;
   this.examineService.querySubjectToAutoSelect(copyParams)
   .subscribe((res: any) => {
     const isSuccess = res.body.success;
     if (isSuccess) {
      const subjectId = res.body.data;
    const type = subjectType;
     if ('0' === type) {
       this.autoTypeId0 = subjectId;
     } else if ('1' === type) {
       this.autoTypeId1 = subjectId;
     } else if ('2' === type) {
       this.autoTypeId2 = subjectId;
     }
     this.msg.info('抽取成功');
     } else {
      this.msg.info(res.body.message);
     }
   });
}

submit() {
  const param = {};

  // tslint:disable-next-line:forin
  for (const key in this.form.controls) {
    this.form.controls[ key ].markAsDirty();
    this.form.controls[ key ].updateValueAndValidity();
    if (!this.form.controls[key].value) {
      return ;
     }
    param[key] =  this.form.controls[key].value;
  }
  this.dataVerify();
  if (!this.isSetSubject) {
    return ;
  }

  const totalScore = this.form.controls.totalScore.value;
// tslint:disable-next-line:triple-equals
if (0 != totalScore && totalScore != this.countSubjectScore) {
  this.msg.info('考试总分与配题中分数总分不一致，请修改');
  return ;
}
  param['manualType'] = this.manualTypeDataSet;
  param['autoType'] = this.autoTypeDataSet;
  param['id'] = this.examId;
  param['countSubject'] = this.countSubject ;
  param['examTimeLength'] = this.form.value.examTimeLength + '';
  param['totalScore'] = this.form.value.totalScore + '';
  this.manualSubList.push({'type': '0', 'ids': this.manualTypeId0 });
  this.manualSubList.push({'type': '1', 'ids': this.manualTypeId1 });
  this.manualSubList.push({'type': '2', 'ids': this.manualTypeId2 });
  param['manualSubList'] = this.manualSubList;
  this.autoSubList.push({'type': '0', 'ids': this.autoTypeId0 });
  this.autoSubList.push({'type': '1', 'ids': this.autoTypeId1 });
  this.autoSubList.push({'type': '2', 'ids': this.autoTypeId2 });
  param['autoSubList'] = this.autoSubList;
   this.examineService.updateExamInfo(param).subscribe(res => {
    const record = res.body;
    if (record && record.success === true) {
     this.msg.info('生成成功');
     this.nzModalRef.destroy();
    } else {
      this.msg.error(record.message);
    }
  });
}

// 保存前校验
dataVerify() {
  this.isSetSubject = true;
   this.countSubjectScore = 0;
   this.countSubject = 0;
try {
 this.manualTypeDataSet.forEach(element => {
   const subject_type = element.subject_type;
   const score = element.score;
   const quantity = element.quantity;
   this.topicIds = null;
   if ( !!score || !!quantity ) {
     if (!score && '0' === subject_type ) {
       this.msg.info('请填写手动配题中单选题单道分数');
       this.isSetSubject = false;
       throw new Error('error');
     }
     if (!score && '1' === subject_type ) {
       this.msg.info('请填写手动配题中多选题单道分数');
       this.isSetSubject = false;
       throw new Error('error');
     }
     if (!score && '2' === subject_type ) {
       this.msg.info('请填写手动配题中判断题单道分数');
       this.isSetSubject = false;
       throw new Error('error');
     }
     if (!quantity && '0' === subject_type ) {
       this.msg.info('请填写手动配题中单选题数量');
       this.isSetSubject = false;
       throw new Error('error');
     }
     if (!quantity && '1' === subject_type ) {
       this.msg.info('请填写手动配题中多选题数量');
       this.isSetSubject = false;
       throw new Error('error');
     }
     if (!quantity && '2' === subject_type ) {
       this.msg.info('请填写手动配题中判断题数量');
       this.isSetSubject = false;
       throw new Error('error');
     }
     let  idArr = [];
      if ( '0' === subject_type ) {
        this.topicIds = this.manualTypeId0;
        if ('' !== this.topicIds && null != this.topicIds) {
          idArr = this.topicIds.split(',');
         }
       if (!!quantity && quantity !== idArr.length) {
         this.msg.info('手动配题设置单选题题目数量为' + quantity + ',实际选择题目数为 ' + idArr.length + ',请修改题目数或重新选取' );
         this.isSetSubject = false;
         throw new Error('error');
       }
     }
     if ( '1' === subject_type ) {
       this.topicIds = this.manualTypeId1;
       if ('' !== this.topicIds && null != this.topicIds) {
        idArr = this.topicIds.split(',');
       }
      if (!!quantity && quantity !== idArr.length) {
        this.msg.info('手动配题设置多选题题目数量为' + quantity + ',实际选择题目数为 ' + idArr.length + ',请修改请修改题目数或重新选取' );
        this.isSetSubject = false;
        throw new Error('error');
      }
    }
    if ( '2' === subject_type ) {
     this.topicIds = this.manualTypeId2;
     if ('' !== this.topicIds && null != this.topicIds) {
      idArr = this.topicIds.split(',');
     }
    if (!!quantity && quantity !== idArr.length) {
      this.msg.info('手动配题设置判断题题目数量为' + quantity + ',实际选择题目数为 ' + idArr.length + ',请修改请修改题目数或重新选取' );
      this.isSetSubject = false;
      throw new Error('error');
    }
  }
      this.countSubjectScore += parseFloat(quantity) * parseFloat(score);
      this.countSubject += parseInt(quantity, 10);
   }
 });
} catch (error) {
}
try {
  this.autoTypeDataSet.forEach(element => {
 const subject_type = element.subject_type;
 const score = element.score;
 const quantity = element.quantity;
 if ( !!score || !!quantity ) {
   if (!score && '0' === subject_type ) {
     this.msg.info('请填写自动配题中单选题单道分数');
     this.isSetSubject = false;
     throw new Error('error');
   }
   if (!score && '1' === subject_type ) {
     this.msg.info('请填写自动配题中多选题单道分数');
     this.isSetSubject = false;
     throw new Error('error');
   }
   if (!score && '2' === subject_type ) {
     this.msg.info('请填写自动配题中判断题单道分数');
     this.isSetSubject = false;
     throw new Error('error');
   }
   if (!quantity && '0' === subject_type ) {
     this.msg.info('请填写自动配题中单选题数量');
     this.isSetSubject = false;
     throw new Error('error');
   }
   if (!quantity && '1' === subject_type ) {
     this.msg.info('请填写自动配题中多选题数量');
     this.isSetSubject = false;
     throw new Error('error');
   }
   if (!quantity && '2' === subject_type ) {
     this.msg.info('请填写自动配题中判断题数量');
     this.isSetSubject = false;
     throw new Error('error');
   }
   let  idArr = [];
   if ( '0' === subject_type ) {
     this.topicIds = this.autoTypeId0;
     if ('' !== this.topicIds && null != this.topicIds) {
      idArr = this.topicIds.split(',');
     }
    if (!!quantity && quantity !== idArr.length) {
      this.msg.info('自动配题设置单选题题目数量为' + quantity + ',实际抽取题目数为 ' + idArr.length + ',请修改题目数或重新抽取' );
      this.isSetSubject = false;
      throw new Error('error');
    }
  }
  if ( '1' === subject_type ) {
   this.topicIds = this.autoTypeId1;
   if ('' !== this.topicIds && null != this.topicIds) {
    idArr = this.topicIds.split(',');
   }
  if (!!quantity && quantity !== idArr.length) {
    this.msg.info('自动配题设置多选题题目数量为' + quantity + ',实际抽取题目数为 ' + idArr.length + ',请修改题目数或重新抽取' );
    this.isSetSubject = false;
    throw new Error('error');
  }
}
if ( '2' === subject_type ) {
 this.topicIds = this.autoTypeId2;
 if ('' !== this.topicIds && null != this.topicIds) {
  idArr = this.topicIds.split(',');
 }
if (!!quantity && quantity !== idArr.length) {
  this.msg.info('自动配题设置判断题题目数量为' + quantity + ',实际抽取题目数为 ' + idArr.length + ',请修改题目数或重新抽取' );
  this.isSetSubject = false;
  throw new Error('error');
}
}
    this.countSubjectScore += parseFloat(quantity) * parseFloat(score);
    this.countSubject += parseInt(quantity, 10);
 }
});
} catch (error) {
}

}



}
