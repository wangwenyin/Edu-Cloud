import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpAddressService } from '@shared/session/http-address.service';

@Component({
  selector: 'app-serch',
  templateUrl: './serch.component.html',
  styleUrls: ['./serch.component.less']
})
export class SerchComponent implements OnInit {
  result: any;
  content: String;
  params = {};
  page = 0;
  size = 16;
  param = {};
  total = 0;
  pageIndex = 1;
  imgSrc: string;
  constructor(
    public msg: NzMessageService,
    private searchService: SearchService,
    private routerInfo: ActivatedRoute,
    private httpAddressService: HttpAddressService,
  ) {
    this.imgSrc = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files/download/';
   }

  ngOnInit() {
    this.content = this.routerInfo.snapshot.queryParams['content'];
    this.routerInfo.queryParamMap.subscribe(params => {
        this.getStringById();
    });
  }

  getStringById() {
    if (this.content && '' !== this.content.trim()) {
      this.params['courseName.contains'] = this.content;
    } else {
      if (this.params['courseName.contains']) {
        delete this.params['courseName.contains'];
      }
    }
    this.params['page'] = this.page - 1;
    this.params['size'] = this.size;
    this.params['isPublish.equals'] = '1';
    this.params['isDelete.equals'] = '0';
    this.searchService.searchContent(this.params).subscribe((subres: any) => {
      this.result = subres.body;
      console.log('成功：',this.result);
      this.total = subres.headers.get('X-Total-Count');
    });
  }
  /**
* 页码数量变动事件
* @param
*/
  pageIndexChange(event) {
    this.page = event;
    this.getStringById();
  }
  pageSizeChange(event) {
    this.size = event;
    this.getStringById();
  }
}
