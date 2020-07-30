import { Component, OnInit , Inject, Input, ElementRef, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { QuestionBankService } from '../question-bank.service';
import { NzMessageService, NzModalRef, UploadFile } from 'ng-zorro-antd';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { CourseService } from 'app/routes/course/course.service';
import { QuestionBank, QuestionOption } from '../question-bank.model';
import { FileUploadService } from '@shared/components/fileUpload/fileUpload.service';
import { HttpAddressService } from '@shared/session/http-address.service';
@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.less']
})
export class AddQuestionComponent implements OnInit {
  // // 选项control
  // controlArray: Array<{ id: number, prefix: string, instance: string }> = [];
  // 单选答案
  singeValue = 'A';
  // 判断答案
  judgeValue = '对';
  // 选项组
  options = [
    {optionPrefixContent: 'A', optionContent: '' , checked : false} , {optionPrefixContent: 'B', optionContent: '' , checked : false},
    {optionPrefixContent: 'C', optionContent: '' , checked : false} , {optionPrefixContent: 'D', optionContent: '' , checked : false}
  ];
  // 课程id
  courseId = '';
  // 课时id
  catalogId = '';
  // 是否增加
  isAdd: boolean;
  // 文件id
  fileId = '';

  haveSelected = false;
  loading = false;
  // 上传地址
  uploadAddress: string;
  // 下载地址
  downloadAddress = '';

  // 题目类别字典No
  SUBJECT_TYPE = 'SubjectType';
  // 题目难度字典No
  SUBJECT_DIFFICULTY = 'SubjectDifficulty';
  subjectType = [];
  subjectDifficulty = [];

  // 是否需要选项
  isNeedOpt = false;
  // 动态加载禁用List
  disabledList = [true];
  // 选中 题目类型
  selectSubjectType = '2';

  fileList = [];

  form: FormGroup;
  // 题目id
  @Input() questionId = '';
  manualTopic = [];
  autoTopic = [];
  // 实体id
  entityId = '';
  entityName = '';
  courseName = '';
  courseList = [];
  catalogList = [];
  prefix = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I', 'J', 'K', 'L', 'M', 'N',
            'O', 'P', 'Q', 'R', 'S', 'T', 'U',
            'V', 'W', 'X', 'Y', 'Z'];


  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private httpAddressService: HttpAddressService,
    public msg: NzMessageService,
    private nzModalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private courseService: CourseService,
    private questionBankService: QuestionBankService,
    @Inject(DA_SERVICE_TOKEN) tokenService: ITokenService,
    ) {
    this.form = this.fb.group({
      id: [null, []],
      isAllowExtract : [false, []],
      subjectType: [null, [Validators.required]],
      eduCourseId: [null, [Validators.required]],
      eduCatalogId: [null, [Validators.required]],
      subjectDifficulty: [null, [Validators.required]],
      subjectSupplyer: [null, [Validators.required]],
      fileId: [null],
      subjectTitle: [null, [Validators.required]],
      subjectDescription: [null],
      optionDTOs: [null]
    });
    this.entityId = tokenService.get().entity_id;
    this.entityName = tokenService.get().entity_name;
    this.uploadAddress = '/thsadmin/api/sys-files/upload';
    this.downloadAddress = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/download/';
  }

  ngOnInit() {
    // this.addField();
    this.getCourseMsg();
    this.getDictDetials();
    if (!this.isAdd) {
      this.loadData();
    }
  }


  // 获取课程数据
  getCourseMsg() {
    const param = {
      'teacherId.equals': this.entityId,
      'isDelete.equals': '0',
      'isPublish.equals': '1',
      'sort': ['orderNum,asc']
    };
    this.courseService.query(param).subscribe(res => {
      if (res && res.body && res.body != null) {
        this.courseList = res.body;
        if (this.courseId !== '') {
          this.form.controls.eduCourseId.setValue(this.courseId);
        }
        if (this.catalogId !== '') {
          this.form.controls.eduCatalogId.setValue(this.catalogId);
        }
      }
    });
  }

  loadData(): void {
    this.msg.loading('加载中');
    this.questionBankService.find(this.questionId).subscribe((res: any) => {
      const record = res.body;
      this.msg.remove();
      if (record && record !== null) {
        const param = {
          'eduSubjectId.equals': record.id,
          'sort': ['orderNum,asc']
        };
        this.questionBankService.queryQuestionOption(param).subscribe((res: any) => {
          this.msg.remove();
          const option = res.body;
          this.fileId = record.fileId;
          this.downloadAddress += this.fileId;
          this.form.controls.id.setValue(record.id);
          this.form.controls.isAllowExtract.setValue(record.isAllowExtract === '1');
          this.form.controls.subjectType.setValue(record.subjectType);
          this.form.controls.eduCourseId.setValue(record.eduCourseId);
          this.form.controls.eduCatalogId.setValue(record.eduCatalogId);
          this.form.controls.subjectDifficulty.setValue(record.subjectDifficulty);
          this.form.controls.subjectSupplyer.setValue(record.subjectSupplyer);
          this.form.controls.fileId.setValue(record.fileId);
          this.form.controls.subjectTitle.setValue(record.subjectTitle);
          this.form.controls.subjectDescription.setValue(record.subjectDescription);
          if (option && option !== null && option.length > 0) {
            if (record.subjectType === '2') {
              option.forEach(e => {
                if (e.isRightAnswer === '1'){
                  this.judgeValue = e.optionContent;
                }
              });
            } else if (record.subjectType === '0') {
              option.forEach(e => {
                if (e.isRightAnswer === '1') {
                  this.singeValue = e.optionPrefixContent;
                }
              });
              this.options = option;
            } else {
                option.forEach(e => {
                  if (e.isRightAnswer === '1') {
                     e.checked = true;
                  } else {
                     e.checked = false;
                  }
                });
                this.options = option;
            }
          }
        });
      }
    });
  }

  // 生成题目提交
  submit() {
    const param = {};
    // tslint:disable-next-line: forin
    for (const key in this.form.controls) {
      this.form.controls[ key ].markAsDirty();
      this.form.controls[ key ].updateValueAndValidity();
      if (this.form.controls[key].value === true) {
        param[key] =  '1';
      } else if (this.form.controls[key].value === false) {
        param[key] =  '0';
      } else {
        param[key] =  this.form.controls[key].value;
      }
    }
    if (this.form.invalid) {
      this.msg.error('请检查题目信息是否完整');
      return;
    }
    param['id'] = this.questionId;
    this.addParam(param);

    if (this.isAdd === true) {
      this.addQuestionInfo(param);
    } else {
      this.modifyQuestionInfo(param);
    }

  }


  modifyQuestionInfo(param: any) {
    this.questionBankService.modifyQuestionInfo(param).subscribe(res => {
      const record = res.body;
      if (record && record.success) {
        this.msg.info('修改成功');
        this.nzModalRef.destroy();
      } else {
        this.msg.error(record.message);
      }
    });
  }


  addQuestionInfo(param: any) {
    this.questionBankService.saveQuestionInfo(param).subscribe(res => {
      const record = res.body;
      if (record && record.success) {
        this.msg.info('保存成功');
        this.nzModalRef.destroy();
      } else {
        this.msg.error(record.message);
      }
    });
  }

  // 增加选项参数
  addParam(param: any) {
    if (this.selectSubjectType === '2' ) {
      // 判断题选项
      // tslint:disable-next-line: max-line-length
      const options = [{'optionPrefixContent' : '对' , 'optionContent' : '对', 'isRightAnswer': '0'},
       {'optionPrefixContent': '错', 'optionContent' : '错', 'isRightAnswer': '0'}];
      if (this.judgeValue === '对') {
        options[0].isRightAnswer = '1';
      } else {
        options[1].isRightAnswer = '1';
      }
      param.optionDTOs = options;
      return;
    }
    if (this.selectSubjectType === '0') {
      // 单选
      this.options.forEach(e => {
        if (e.optionPrefixContent === this.singeValue) {
          e['isRightAnswer'] = '1';
        } else {
          e['isRightAnswer'] = '0';
        }
      });
      param.optionDTOs = this.options;
      return;
    }
    if (this.selectSubjectType === '1') {
      this.options.forEach(e => {
        if (e.checked === true) {
          e['isRightAnswer'] = '1';
        } else {
          e['isRightAnswer'] = '0';
        }
      });
      param.optionDTOs = this.options;
      return;
    }



  }

  // 获取字典详情
  getDictDetials() {
    this.questionBankService.findAllByDictNo(this.SUBJECT_TYPE).subscribe(res => {
      if (res.body && res.body != null && res.body.length > 0) {
        this.subjectType = res.body;
      }
    });
    this.questionBankService.findAllByDictNo(this.SUBJECT_DIFFICULTY).subscribe(res => {
      if (res.body && res.body != null && res.body.length > 0) {
        this.subjectDifficulty = res.body;
      }
    });
  }

  // 选中题目类型
  subjectTypeChange(value: string) {
     this.selectSubjectType = value;
    if (value === '2') {
      this.isNeedOpt = false;
    } else {
      this.isNeedOpt = true;
    }
  }

  // 选择课程后联动课时
  provinceChange(courseId: string): void {
    this.form.controls.eduCatalogId.setValue('');
    const param = {
      'eduCourseId.equals': courseId,
      'isOk.equals': '1',
      'isAudit.equals': '1',
      'sort': ['orderNum,asc']
    };
    this.questionBankService.queryCourseCatalogs(param).subscribe((res: any) => {
      if (res && res.body && res.body !== null) {
        this.catalogList =  res.body;
        this.disabledList[0] = false;
      }
    });
  }

  // 增加选项
  addField(): void {
    const tmp =  {optionPrefixContent: 'A', optionContent: '' , checked : false};
    tmp.optionPrefixContent = this.prefix[this.options.length];
    this.options.push(tmp);
        //  {optionPrefixContent: 'A', optionContent: '' , checked : false} 
    // const id = (this.controlArray.length > 0) ? this.controlArray[ this.controlArray.length - 1 ].id + 1 : 0;
    // const control = {
    //   id,
    //   prefix:  `prefix${id}`,
    //   instance: `option${id}`
    // };
    // const index = this.controlArray.push(control);
  }

  // 移除选项
  removeField(i): void {
    if (this.options.length > 1) {
      const index = this.options.indexOf(i);
      this.options.splice(index, 1);
    }
  }

  prefixChange(i: string, p: boolean ) {
    const flag = this.form.controls['prefix' + i].value;
    this.form.controls['prefix' + i].setValue(flag);
  }

   // 上传文件参数
   fileParam = (file: UploadFile) => {
    const tmp = {
      name : file.name,
      fileFk : this.questionId,
      fileDesc: file.name,
      uploader : this.entityName,
      fileType : file.name.substring(file.name.indexOf('.') + 1 )
    };
   return tmp;
 }


 beforeUpload = (file: UploadFile): boolean => {
  const format = ['doc', 'docx', 'xls' , 'xlsx', 'txt' , 'pdf', 'bmp', 'jpg' , 'png', 'gif', 'svg' , 'jpeg'];
  const type = file.name.substring(file.name.indexOf('.') + 1 ).toLowerCase();
    if (format.indexOf(type) < 0) {
      this.msg.error('格式错误,仅支持' + format + '格式');
      return false;
    }
   this.fileList.push(file);
   return true;
 }


  handleUploadChange(item: any) {
    if (item.type === 'success') {
      const res = item.file.response;
      this.form.controls['fileId'].setValue(res.id);
    }
  }

}
