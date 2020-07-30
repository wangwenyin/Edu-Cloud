import { Component, OnInit, Inject } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { NewsService } from './news.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import * as moment from 'moment';

@Component({
  selector: 'app-teacher-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {
  constructor(
    fb: FormBuilder,
    public msg: NzMessageService,
    private sanitizer: DomSanitizer,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private newsService: NewsService,
    private titleService: Title
  ) {
  }

 
  ngOnInit() {
    this.titleService.setTitle('个人中心');
    this.loadData();
  }

  loadData() {
  }

  selectTab(index: number) {
  }
}
