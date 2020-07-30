import { Component, OnInit, Inject, Input } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { CatalogService } from './edit.service';
import { FileUploadService } from '@shared/components/fileUpload/fileUpload.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class CourseEditComponent implements OnInit {

  courseHourList = [];
  @Input() courseId = '';
  fileList: UploadFile[] = [];
  courseFileList = [];
  isAdding = false;
  // courseId = '1';
  uploadAddress: string;
  isShowResource = false;
  videoTime = 0;
  curIndex: number;
  curCourseHourId = '';
  uploadType = '-1';
  queryParams = {
     'sort': ['orderNum,asc'],
     'isOk.equals': '1'
  };
  constructor(
    private catalogService: CatalogService,
    private fileUploadService: FileUploadService,
    public sanitizer: DomSanitizer,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.uploadAddress = '/thsadmin/api/sys-files/upload';
  }

  ngOnInit() {
    this.loadData();
  }
  // 加载数据
  loadData() {
    this.queryParams['eduCourseId.equals'] = this.courseId;
    this.msg.remove();
    this.msg.loading('加载中');
    this.catalogService.query(this.queryParams).subscribe(res => {
      const tmp = res.body;
      this.msg.remove();
      if (tmp && tmp !== null && tmp.length > 0) {
         this.courseHourList = tmp;
      }
    });
}

// 展开关闭文件上传框
  toggle(i: number) {
    if (this.curIndex === i) {
      this.curIndex = -1;
    } else {
      this.msg.remove();
      this.msg.loading('加载中');
      this.curIndex = i;
      const item = this.courseHourList[this.curIndex];
       if (!item.id || item.id === null || item.id === '') {
         this.msg.remove();
         this.msg.info('请先保存课时');
         return;
       }
      this.curCourseHourId = item.id;
      this.loadCourseFile(item.id);
    }
  }

 // 编辑课时
  edit(i: number) {
    const item = this.courseHourList[i];
    if (!item || item === null) {
      this.msg.remove();
      this.msg.error('错误，请刷新重试');
      return;
    }
    if (!item.id || item.id === null || item.id === '') {
      this.msg.remove();
      this.msg.error('清先保存课时');
      return;
    }
    item.isEdit = true;
    if (this.curIndex !== i) {
      this.toggle(i);
    }
  }

  // 保存课时
  save(i: any) {
    const item = this.courseHourList[i];
    if (!item.name || item.name === null || item.name === '') {
      this.msg.remove();
      this.msg.error('请输入课程名称');
      return;
    }

    const param = {
      eduCourseId: this.courseId,
      isAudit: '0',
      isTrial: '0',
      isPublish: '0',
      isOk: '1',
      duration: item.duration,
      name: item.name,
    };
    if (!item.id || item.id === null || item.id === '') {
      param['orderNum'] = this.courseHourList.length;
      this.msg.remove();
      this.msg.loading('加载中');
      this.catalogService.create(param).subscribe(res => {
        this.msg.remove();
        this.msg.info('保存成功');
        if (i === this.courseHourList.length - 1 &&　this.isAdding === true) {
          // tslint:disable-next-line: no-unused-expression
          this.isAdding = false;
        }
        this.loadData();
      });
    } else {
      param['id'] = item.id;
      param['orderNum'] = item.orderNum;
      this.msg.remove();
      this.msg.loading('加载中');
      this.catalogService.update(param).subscribe(res => {
        this.updateFile(item.doc);
        this.updateFile(item.ppt);
        this.updateFile(item.video);
        this.msg.remove();
        this.msg.info('修改成功');
        item.isEdit = false;
      });
    }
  }

 // 修改文件
  updateFile(param) {
    if (param.id && param.id !== null && param.id !== '') {
      this.fileUploadService.update(param).subscribe(res => {
      });
    }
 }

 // 删除课时
 delete(i: number) {
  const item = this.courseHourList[i];
  if (item && item !== null) {
    if (!item.id || item.id === null || item.id === '') {
      // 仅删除前端数据
      this.isAdding = false;
      this.courseHourList.splice(i, 1);
    } else {
      this.catalogService.delete(item.id).subscribe(res => {
        const code = res.status;
        if (code === 200) {
         this.msg.remove();
         this.msg.info('删除成功');
         this.loadData();
        } else {
         this.msg.remove();
         this.msg.error('删除失败');
        }
      });
    }
  }
 }

  // 加载课时文件
  loadCourseFile(id: any) {
    const queryParams = Object.assign({
      'fileFk.equals': id,
      'sort': 'createdDate,asc',
    });
    this.fileUploadService.query(queryParams).subscribe((res) => {
      this.courseFileList = res.body;
      this.addCourseFile();
      this.courseFileList.forEach(ele => {
        ele.fileSizeForRead = this.fileUploadService.readablizeBytes(ele.fileSize);
        this.addFileTocourseHourList(ele);
      });
      this.msg.remove();
    });
 }

 // 将文件数据加到课时中去
  private addFileTocourseHourList(ele: any) {
   if (ele.extField1  === '0') {
      this.courseHourList[this.curIndex].doc = ele;
      return;
    }

    if (ele.extField1  === '1') {
      this.courseHourList[this.curIndex].ppt = ele;
      return;
    }

    if (ele.extField1  === '2') {
      this.courseHourList[this.curIndex].video = ele;
      return;
    }
 }

  addCourseFile() {
    this.courseHourList[this.curIndex].doc = { name: '', size: 0, time: ''};
    this.courseHourList[this.curIndex].ppt = { name: '', size: 0, time: '' };
    this.courseHourList[this.curIndex].video = { name: '', size: 0, time: '' };
  }

  addCourseHour() {
    if (this.isAdding === true){
      this.msg.remove();
      this.msg.info('清先保存课时');
      return;
    }
    this.isAdding = true;
    this.courseHourList.push({ name: '', isEdit: true });
  }

  changeUploadType(type: string) {
    this.uploadType = type;
  }

  beforeUpload = (file: UploadFile): boolean => {
    const docFormat = ['doc', 'docx', 'xls' , 'xlsx', 'txt' , 'pdf'];
    const pptFormat = ['ppt', 'pptx', 'pdf'];
    const videoFormat = ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', '3gp'];
    const type = file.name.substring(file.name.indexOf('.') + 1 ).toLowerCase();
    if (this.uploadType === '0') {
      if (docFormat.indexOf(type) < 0) {
        this.msg.error('格式错误,仅支持' + docFormat + '格式');
        return false;
      }
    }
    if (this.uploadType === '1') {
      if (pptFormat.indexOf(type) < 0) {
        this.msg.error('格式错误,仅支持' + pptFormat + '格式');
        return false;
      }
    }

    if (this.uploadType === '2') {
      if (videoFormat.indexOf(type) < 0) {
        this.msg.error('格式错误,仅支持' + videoFormat + '格式');
        return false;
      }
    }
    this.fileList.push(file);
    return true;
  }

   // 上传文件参数
   fileParam = (file: UploadFile) => {
    const tmp = {
      name : file.name,
      fileFk : this.curCourseHourId,
      fileDesc: file.name,
      uploader : this.tokenService.get().entity_name,
      fileType : file.name.substring(file.name.indexOf('.') + 1 ),
      extField1 : this.uploadType
    };
   return tmp;
 }

 // 上传成功后把旧文件删除
  handleUploadChange(item: any) {
    if (item.type === 'success') {
      const res = item.file.response;
      res.fileSizeForRead = this.fileUploadService.readablizeBytes(res.fileSize);
      res.createdDate = moment( res.createdDate).format('YYYY-MM-DD HH:mm:ss');
      const ele = this.courseHourList[this.curIndex];
      if (res.extField1 === '0') {
        if (ele.doc.id && ele.doc.id !== null) {
          this.fileUploadService.delete(ele.doc.id).subscribe(val => {
            console.log('delete file');
          });
        }
        ele.doc = res;
      }
      if (res.extField1 === '1') {
        if (ele.ppt.id && ele.ppt.id !== null) {
          this.fileUploadService.delete(ele.ppt.id).subscribe(val => {
            console.log('delete file');
          });
        }
        ele.ppt = res;
      }
      if (res.extField1 === '2') {
        if (ele.video.id && ele.video.id !== null) {
          this.fileUploadService.delete(ele.video.id).subscribe(val => {
            console.log('delete file');
          });
        }
        const url = URL.createObjectURL(this.fileList[this.fileList.length - 1]);
        const oVideo = document.createElement('video');
        oVideo.setAttribute('src', url);
          oVideo.oncanplay = () => {
            //  alert('视频时长：' + oVideo.duration + '秒');
            res.extField2 = oVideo.duration;
            const param = {
              id : res.fileFk,
              duration: oVideo.duration
            };
            this.catalogService.updateCatalogDuration(param).subscribe( v => {
              console.log('时长增加成功');
            });

             console.log(item);
            // this.videoTime =  oVideo.duration;
        };
        ele.video = res;
      }
    }
 }
}
