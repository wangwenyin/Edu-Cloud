import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InformationService } from './info.service';
import { SummarizeService } from './summarize/summarize.service';
import { Info } from './info.model';
import { DictDetailService } from '@shared/components/dict/dict-detail.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class CourseInfoComponent implements OnInit {

  loading = false;
  isAddLoading = false;
  courseCoverUrl: string;
  validateForm: FormGroup;
  data: any[] = [];
  @Input() courseId = '';
  // courseId = '1';
  // 分类id
  @Input() classifyId = '';
  @Input() courseTypeId = '';
  courseType = [];
  course: Info;
  // isLoading = true;
  courseTitle = '上传封面图';
  summarizeTitle = '上传概述图';
  summarizeIndex = 0;
  summarizeList = [];
  contentList = [];
  idList = [];
  queryParams = {
    // sort固定
     sort: ['order_num,asc'],
     'id.equals': this.courseId,
     'isDelete.equals': '0'
  };

  summarizeParams = {
    // sort固定
     sort: ['order,asc'],
  };



  constructor(
    private msg: NzMessageService,
    public informationService: InformationService,
    public summarizeService: SummarizeService,
    private dictDetailService: DictDetailService,
    private fb: FormBuilder
    ) {
      this.validateForm = this.fb.group({
      courseName: ['', [ Validators.required ]],
      courseType: ['', [ Validators.required ]],
      teacherName: [ '', [ Validators.required ] ],
      introduction: [ '', [ Validators.required ] ],
      target : [ '', [ Validators.required ] ],
      totalHours : ['', [ Validators.required, Validators.pattern(/^[0-9]*[1-9][0-9]*$/)]]
    });
  }

  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.msg.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.courseCoverUrl = img;
      });
    }
  }


  ngOnInit() {
    this.msg.loading('加载中');
    this.loadData();
  }

  loadData(): void {
    this.informationService.find(this.courseId).subscribe((res: any) => {
      const record = res.body;
      this.msg.remove();
      if (record && record !== null) {
        // tslint:disable-next-line: forin
        this.course = record;
        this.validateForm.controls.courseName.setValue(this.course.courseName);
        this.validateForm.controls.teacherName.setValue(this.course.teacherName);
        this.validateForm.controls.introduction.setValue(this.course.introduction);
        this.validateForm.controls.target.setValue(this.course.target);
        this.validateForm.controls.totalHours.setValue(this.course.totalHours);
        this.validateForm.controls.courseType.setValue(this.course.courseType);
      }
    });
   this.getSummarizes();
   this.getCourseType();
  }

  getCourseType() {
   const param = {
     'parentId.equals' : this.courseTypeId,
     'isOk.equals' : '1',
     sort: ['orderNum,asc']
    };
    this.dictDetailService.query(param).subscribe(res => {
      this.courseType = res.body;
    });
  }


  submitForm = ($event, value) => {
    $event.preventDefault();
    // tslint:disable-next-line: forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
      this.course[key] =  this.validateForm.controls[ key ].value;
    }
    if (this.validateForm.invalid) {
      this.msg.error('请检查课程信息是否完整');
      return;
    }
    console.log(value);
    this.saveCourse();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    // tslint:disable-next-line: forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  saveCourse() {
    this.loading = true;
    this.informationService.update(this.course).subscribe(res => {
      const code = res.status;
      if (code === 200) {
        this.saveSummarize();
      } else {
        this.msg.error('保存失败');
        this.loading = false;
      }
    });
  }

  saveSummarize() {
    for (let i = 0; i < this.summarizeList.length; i++) {
      const item = this.summarizeList[i];
      item.content = this.contentList[i];
    }
    this.summarizeService.batchUpdate(this.summarizeList).subscribe(res => {
      const val = res.body;
      if (val.success === true) {
        this.msg.success('保存成功');
        this.loadData();
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  addSummarize() {
    this.isAddLoading = true;
    const param = {
      order : this.summarizeIndex,
      courseId : this.courseId
    };
    this.summarizeService.create(param).subscribe(res => {
      this.summarizeList[this.summarizeIndex] = res.body;
      this.idList[this.summarizeIndex] = res.body.id;
      this.summarizeIndex ++;
      this.msg.info('增加成功');
      this.isAddLoading = false;
    });
  }

  deleteSummarize(i, obj: any) {
    obj.target.setAttribute('disabled', true);
    this.summarizeService.delete(this.summarizeList[i].id).subscribe(res => {
      this.loadData();
      this.msg.info('删除成功');
    });
  }

  getSummarizes() {
    this.summarizeParams['courseId.equals'] = this.courseId;
    this.summarizeService.query(this.summarizeParams).subscribe(res => {
      const record = res.body;
      this.summarizeList = record;
      this.contentList = this.summarizeList.map(s => s.content);
      this.idList = this.summarizeList.map(s => s.id);
      this.summarizeIndex = record.length;
    });
  }

}
