import { Component, OnInit, Inject } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { StudentNewsService } from './student-news.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';

@Component({
  selector: 'app-student-news',
  templateUrl: './student-news.component.html',
  styleUrls: ['./student-news.component.less']
})
export class StudentNewsComponent implements OnInit {
  constructor(
    fb: FormBuilder,
    public msg: NzMessageService,
    private sanitizer: DomSanitizer,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private studentNewsService: StudentNewsService,
    private titleService: Title
  ) {
    this.userId = this.tokenService.get().account_id;
  }
  // 数据list
    // 数据list
    customerData = {
      list: [],
      total: ''
    };
    evaluateData = {
      list: [],
      total: ''
    };
    interactionData = {
      list: [],
      total: ''
    };
  loading = true;
  // 当前分页
  page = 1;
  // 分页大小
  size = 10;
  // 数据总数
  total = '';
  // 用户id
  userId = '';
  // 选中tab
  selectIndex = 0;
  // 查询参数
  queryParam = {
    'sort': ['send_time', 'asc'],
    'page': this.page - 1,
    'size': this.size
  };


  ngOnInit() {
    this.titleService.setTitle('个人中心');
    this.loadData();
  }

  loadData() {
    this.initList(0);
    this.initList(1);
    this.initList(2);
  }

  initList(index: number) {
    this.studentNewsService.queryNews(index, this.queryParam).subscribe(res => {
      const records = res.body;
      if (records && records !== null && records.length > 0) {
        // tslint:disable-next-line: forin
        for (const key in records) {
          records[key]['sendTime'] = moment(records[key]['sendTime']).format('YYYY-MM-DD HH:mm:ss');
          records[key]['readTime'] = moment(records[key]['readTime']).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      if (index === 0) {
        this.interactionData.list = res.body;
        this.interactionData.total = res.headers.get('X-Total-Count');
      }
      if (index === 1) {
        this.evaluateData.list = res.body;
        this.evaluateData.total = res.headers.get('X-Total-Count');

      }
      if (index === 2) {
        this.customerData.list = res.body;
        this.customerData.total = res.headers.get('X-Total-Count');
      }
      this.loading = false;
    });
  }


  updateIsRead(id: string) {
    this.studentNewsService.updateIsRead(id).subscribe(res => {
      const record = res;
      if (record && record.success === true) {
        this.loadData();
      }
    });
  }

  selectTab(index: number) {
  }
}
