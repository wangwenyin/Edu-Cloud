import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';

@Injectable({ providedIn: 'root' })
export class LearnHomeworkService extends ThsBaseService<any> {
  constructor(
     http: HttpClient,
     httpAddressService: HttpAddressService,
  ) {
    super(http, httpAddressService.EduServe + '/edu-homeworks');
  }

  queryHomeworkMsg(courseId: string, catalogId: string) {
    return this.http.get<any[]>(this.resourceUrl + '/msg/' + courseId + '/' + catalogId, {observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  queryHomework(homewordId: string) {
    return this.http.get<any[]>(this.resourceUrl + '/test/' + homewordId , {observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  queryHomeworkToView(homeworkId: string, studentId: string) {
    return this.http.get<any[]>(this.resourceUrl + '/findStudentHomework?homeworkId=' + homeworkId +
    '&studentId=' + studentId , {observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }
}
