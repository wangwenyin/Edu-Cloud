import { Component, Input } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EvaluateService } from './evaluate.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.less']
})
// tslint:disable-next-line: component-class-suffix
export class CourseEvaluateComponent implements OnInit {
  public page = 1;
  public size = 5;
  public total: number;
  data: any[] = [];
  // courseId = 'f832945a-888c-4974-8ced-6b877446f685';
  isLoading = true;
  @Input() courseId = '';

  queryParams = {
    size: this.size,
    sort: ['appraise_time,desc']
  };


  constructor(
    public msg: NzMessageService,
    public http: _HttpClient,
    public modal: ModalHelper,
    public modalService: NzModalService,
    public sanitizer: DomSanitizer,
    public evaluateService: EvaluateService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.queryParams['page'] = this.page - 1 ;
    this.evaluateService.queryEvaluate(this.courseId, this.queryParams).subscribe((res: any) => {
      const record = res.body;
      if (record && record !== null && record.success === true) {
        // tslint:disable-next-line: forin
        for (const key in record.data) {
              record.data[key]['appraiseTime'] = moment(record.data[key]['appraiseTime']).format('YYYY-MM-DD HH:mm:ss');
        }
        this.data = record.data;
        this.isLoading = false;
        this.total = res.headers.get('X-Total-Count');
      }
    });
  }


}
