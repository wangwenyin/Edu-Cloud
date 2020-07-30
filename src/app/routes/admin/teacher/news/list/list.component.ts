import { Component, OnInit, Inject, Input } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-teacher-news-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class NewsListComponent implements OnInit {
  constructor(
    public msg: NzMessageService,
    private sanitizer: DomSanitizer,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private newsService: NewsService,
  ) {
    this.userId = this.tokenService.get().account_id;
  }
  // 数据list
  dataList = [];

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
  @Input() index = 0;
  // 查询参数
  queryParam = {
    'sort': ['send_time,asc'],
    'size': this.size
    };


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.initList();
  }

  initList() {
    this.queryParam['page'] = this.page - 1;
    this.newsService.queryNews(this.index, this.queryParam).subscribe(res => {
      const records = res.body;
      if (records && records !== null && records.length > 0) {
        // tslint:disable-next-line: forin
        for (const key in records) {
          records[key]['sendTime'] = moment(records[key]['sendTime']).format('YYYY-MM-DD HH:mm:ss');
          records[key]['readTime'] = moment(records[key]['readTime']).format('YYYY-MM-DD HH:mm:ss');
        }
      }
        this.dataList = res.body;
        this.total = res.headers.get('X-Total-Count');
      this.loading = false;
    });
  }



  updateIsRead(id: string) {
    this.newsService.updateIsRead(id).subscribe(res => {
      const record = res;
      if (record && record.success === true) {
        this.loadData();
      }
    });
  }

}
