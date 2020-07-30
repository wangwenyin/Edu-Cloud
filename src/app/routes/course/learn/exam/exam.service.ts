import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { Exam } from 'app/routes/admin/teacher/examine/exam.model';

@Injectable({ providedIn: 'root' })
export class LearnExamService extends ThsBaseService<Exam> {
  constructor(
     http: HttpClient,
     httpAddressService: HttpAddressService,
  ) {
    super(http, httpAddressService.EduServe + '/edu-exams');
  }

  queryByCourseId(courseId: string): Observable<HttpResponse<Exam[]>> {
    return this.http.get<Exam[]>(this.resourceUrl + '/has/' + courseId, {observe: 'response'})
    .pipe(map((res: HttpResponse<Exam[]>) => this.convertDateArrayFromServer(res)));
  }

  queryExamMsgByCourseId(courseId: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/msg/' + courseId, {observe: 'response'});
  }

  queryExam(courseId: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/test/' + courseId , {observe: 'response'});
  }

  queryExamToView(examId: string, studentId: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/getStuedntExamResult?examId=' + examId +
    '&studentId=' + studentId , {observe: 'response'});
  }
}
