import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnChanges, Input, Output, EventEmitter, OnInit, SimpleChanges, Inject, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { FileUploadService } from './fileUpload.service';
import * as moment from 'moment';
import { environment } from '@env/environment';
import { GuidUtil } from '@shared/utils/guid.util';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ths-file-upload',
  templateUrl: './fileUpload.component.html',
  styles  : [
    `
      .editable-row-operations a {
        margin-right: 8px;
      }
      :host ::ng-deep .ant-table-title{
        margin-top: 10px;
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      :host ::ng-deep .ant-list-item-content-single{
        justify-content: space-between;
      }
      :host ::ng-depp .ant-alert-icon.anticon{
        top: 8px;
      }
      :host ::ng-deep i {
        font-size: 32px;
        color: #999;
      }
      :host ::ng-deep .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
      :host ::ng-deep .ant-upload.ant-upload-select-picture-card{
        width:100%;
        height:228px;
      }

      :host ::ng-deep .ant-upload-list-picture-card .ant-upload-list-item{
        width:100%;
        height:228px;
        margin-bottom:34px;
      }
    `
  ]
})
export class FileUploadComponent implements OnChanges, OnInit  {

  /**
   * 文件列表左上方的标题名
   */
  @Input() fileListTitle: String = '';
  /**
   * 是否只读，已废弃
   */
  @Input() readOnly: boolean = true;
  /**
   * 是否可上传
   */
  @Input() uploadable: boolean = true;
  /**
   * 是否可修改
   */
  @Input() editable: boolean = true;
  /**
   * 是否可删除
   */
  @Input() deleteable: boolean = true;
  /**
   * 是否仅本人编辑
   */
  @Input() selfOnly: boolean = false;
  /**
   * 是否允许修改文件名（仅table样式下有效）
   */
  @Input() changeFileName: boolean = false;
  /**
   * 组件样式 默认table  "table"|"list"|"preview"
   */
  @Input() display: string = 'preview';
  /**
   * 业务外键，根据业务外键加载，上传文件，为空时无法进行上传（页面上会有提示）
   */
  @Input() fileFk;
  /**
   * 文件数量限制，达到数量上限后无法上传（页面上会有提示） 默认无限
   */
  @Input() fileCountLimit: number = -1;
  /**
   * 单个文件大小限制，超过大小限制则无法上传（选择文件后会有提示） 默认从后台读取配置
   */
  @Input() sizeLimit: number = -1;
  /**
   * 第一列字段值（仅table模式有效）
   */
  @Input() firstColumn:string = '';
  /**
   * 第一列字段名（仅table模式有效）
   */
  @Input() firstColumnName:string = '';

  /**
   * 额外参数 加载文件时会作为参数进行加载，如有需要可参考sys_files表的字段进行添加
   */
  @Input() loadExtParams: {} = {};
  /**
   * 额外参数 上传文件时会作为参数进行保存，如有需要可参考sys_files表的字段进行添加
   */
  @Input() uploadExtParams: {} = {};
  /**
   * 单个文件上传完成的回调 {success:boolean(是否成功), file: file(对应文件属性)}
   */
  @Output() uploadFinish: EventEmitter<{}> = new EventEmitter<{}>();
  /**
   * 所有文件上传完成的回调 {successFile: file[](上传成功的文件), failedFile: file[](上传失败的文件)}
   */
  @Output() allUploadFinish: EventEmitter<{}> = new EventEmitter<{}>();
  uploading = false;
  fileList: UploadFile[] = [];
  pFileList = [];
  uploadLength = 0;
  i = 1;
  failedFileList: UploadFile[] = [];
  successedFileList: UploadFile[] = [];
  editIndex = -1;
  dataSet = [];
  guid = new GuidUtil().toString();
  accountName = '';
  personName = '';
  tempEditData = {};
  uploadAddress = '';
  previewAddress = '';
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private fileUploadService: FileUploadService) {
      this.uploadAddress = '/thsadmin/api/sys-files/upload';
      this.previewAddress = environment.SERVER_URL + '/thsadmin/api/sys-files/preview/';
    }

  ngOnInit(): void {
    this.accountName = this.tokenService.get().account_name;
    this.personName = this.tokenService.get().entity_name;
    if (this.sizeLimit === -1) {
      // TODO 从后台读取配置 暂定为1GB
      this.sizeLimit = 10000000;
    }
    this.initFiles();
  }

  initFiles() {
    if (this.fileFk !== undefined && this.fileFk !== '') {
      const queryParams = Object.assign({
        'fileFk.equals': this.fileFk,
        'sort': 'createdDate,asc',
      }, this.loadExtParams);
      this.fileUploadService.query(queryParams).subscribe((res) => {
        this.dataSet = res.body;
        this.pFileList = res.body;
        this.dataSet.forEach(ele => {
          ele.fileSizeForRead = this.fileUploadService.readablizeBytes(ele.fileSize);
        });
        this.pFileList.forEach(ele => {
          ele.url = this.previewAddress + ele.id;
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fileFk'] && changes['fileFk'].currentValue) {
      this.initFiles();
    }
  }


  startEdit(idx: number): void {
    this.tempEditData = Object.assign({}, this.dataSet[idx]);
    this.editIndex = idx;
  }

  cancelEdit(): void {
    this.editIndex = -1;
  }
  delEdit(idx: number): void {
    const id = this.dataSet[idx].id;
    const uid = this.dataSet[idx].uid;
    if (id) {
      this.fileUploadService.delete(id).subscribe(() => {
        this.dataSet = this.dataSet.filter(d => d.id !== id);
      });
    } else {
      this.uploadLength --;
      this.dataSet = this.dataSet.filter(d => d.uid !== uid);
    }

    this.editIndex = -1;
  }

  saveEdit(idx: number): void {
    this.dataSet[idx] = Object.assign(this.dataSet[idx], this.tempEditData);
    this.editIndex = -1;
    const id = this.dataSet[idx].id;
    if (id) {
      const data = this.dataSet[idx];
      this.fileUploadService.update(data).subscribe(res => {
        this.dataSet[idx] = res.body;
        this.dataSet[idx].fileSizeForRead = this.fileUploadService.readablizeBytes(this.dataSet[idx].fileSize);
      });
    }
  }


  beforeUpload = (file: UploadFile): boolean => {
    const isLt1GB = file.size / 1024 / 1024 / 1024 < 1;
    if (!isLt1GB) {
      this.msg.error('文件大小不能超过1GB!');
      return false;
    }
    this.uploadLength ++;
    file.uploader = this.personName;
    file.fileDesc = file.name;
    file.fileName = file.name;
    file.fileType = file.name.substring(file.name.indexOf('.') + 1);
    file.fileSizeForRead = this.fileUploadService.readablizeBytes(file.size);
    this.dataSet = [ file, ...this.dataSet];
    this.cdr.detectChanges();
    if (this.display === 'preview') {
      this.handleUpload();
    } else {
      return false;
    }
  }


  downFile(idx) {
    const file = this.dataSet[idx];
    const a = document.createElement('a');
    const url =  environment.SERVER_URL + '/thsadmin/api/sys-files/download/' + file.id;
    const filename = file.fileName;
    a.href = url;
    a.download = filename;
    a.click();

    // TODO blob会限制大小 500MB左右
    // this.fileUploadService.downloadById(file.id).subscribe((res) => {
    //   let data=res.body;
    //   let blob = new Blob([data], {type: file.fileType});
    //   let objectUrl = URL.createObjectURL(blob);
    //   let a = document.createElement('a');
    //   a.setAttribute('style', 'display:none');
    //   a.setAttribute('href', objectUrl);
    //   a.setAttribute('download', file.fileName);
    //   a.click();
    //   // URL.revokeObjectURL(objectUrl);

    // });
  }
  fileChange(event: any) {
    console.log(event);
  }

  handleUpload(): void {
    this.uploading = true;
    let uploadList = this.uploadLength;
    this.failedFileList = [];
    this.successedFileList = [];
    this.dataSet.forEach((file: any) => {
      if (file.id !== undefined && file.id !== '') {
        return;
      }
      const formData = new FormData();
      // 添加额外参数
      // tslint:disable-next-line: forin
      for (const p in this.uploadExtParams) {
        let newP = '';
        if (p.indexOf('.')) {
          newP = p.substr(0, p.indexOf('.'));
        } else {
          newP = p;
        }
        formData.append(newP, this.uploadExtParams[p]);
      }
      formData.append('name', file.fileName || '');
      formData.append('fileFk', this.fileFk || this.guid);
      formData.append('fileDesc', file.fileDesc || file.fileName);
      formData.append('uploader', file.uploader || '');
      // plupload自己后台处理了Type和size
      formData.append('fileType', file.fileType || '');
      // 文件
      formData.append('files[]', file);
      const req = new HttpRequest('POST', '/thsadmin/api/sys-files/upload', formData, {
         reportProgress: true
      });
      this.http.request(req)
        .subscribe(
          (event:  HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                return `Uploading file "${file.name}" of size ${file.size}.`;
              case HttpEventType.UploadProgress:
                // Compute and show the % done:
                const percentDone = Math.round(100 * event.loaded / event.total);
                file.percent = percentDone;
                return ;
              case HttpEventType.Response:
                if (event.status === 201) {
                  this.uploadLength --;
                  event.body.createdDate = moment(event.body.createdDate).format('YYYY-MM-DD HH:mm:ss');
                  // lastModifiedDate该属性报错，莫名其妙
                  delete event.body.lastModifiedDate;
                  file = Object.assign(file, event.body);
                  file.fileSizeForRead = this.fileUploadService.readablizeBytes(file.fileSize);
                  this.successedFileList.push(file);
                  this.uploadFinish.emit({success: true, file: file});
                } else {
                  this.failedFileList.push(file);
                  this.uploadFinish.emit({success: false, file: file});
                }
                return `File "${file.name}" was completely uploaded!`;
              default:
                if (event['status'] === 0 && event['statusText'] === 'OK') {
                  this.failedFileList.push(file);
                  this.uploadFinish.emit({success: false, file: file});
                }
                return `File "${file.name}" surprising upload event: ${event.type}.`;
            }
          },
          () => {
            // this.uploadFinish.emit({success: false, file: file});
            // this.failedFileList.push(file);
            this.msg.error(file.name + '上传失败');
          },
          () => {
            file.percent = 0;
            uploadList--;
            if (uploadList === 0) {
              this.allUploadFinish.emit({successFile: this.successedFileList, failedFile: this.failedFileList});
              this.fileList = this.failedFileList;
              this.uploading = false;
            }
          }
        );
    });
  }

  updateGuidToFk(newFk: string) {
    this.fileUploadService.updateFkBatch(this.guid, newFk).subscribe(() => {});
  }


  deleteByGuid() {
    this.fileUploadService.deleteAllByFk(this.guid).subscribe(() => {});
  }


  // tslint:disable-next-line: member-ordering
  previewImage = '';
  // tslint:disable-next-line: member-ordering
  previewVisible = false;

  handlePreview = (file: UploadFile) => {
    console.log(this.pFileList);
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  fileParam = (file: UploadFile) => {
    const tmp = {
      name : file.name,
      fileFk : this.fileFk,
      fileDesc: file.name,
      uploader : this.personName,
      fileType : file.name.substring(file.name.indexOf('.') + 1 )

    };
   return tmp;
 }

  handleUploadChange(item) {
    if (item.type === 'removed') {
      this.fileUploadService.delete(item.file.id).subscribe(() => {
        this.msg.info('删除成功');
      });
  }

}
}
