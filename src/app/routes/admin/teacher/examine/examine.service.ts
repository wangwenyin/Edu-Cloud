import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Exam } from './exam.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ExamineService extends ThsBaseService<any> {
  courseUrl = '';
  examTypeUrl = '';
  topicUrl = '';
  subjectUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-exams');
      this.courseUrl = httpAddressService.EduServe + '/edu-courses';
      this.examTypeUrl = httpAddressService.EduServe + '/edu-exam-types';
      this.topicUrl = httpAddressService.EduServe + '/edu-exam-topics';
      this.subjectUrl = httpAddressService.EduServe + '/edu-subjects';
  }


  queryCourse(teacherId: string): Observable<HttpResponse<any[]>> {
    const url = this.courseUrl + '/getCourseByTeacherId?teacherId=' + teacherId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }


  queryExam(type: any, queryParams ?: any): Observable<HttpResponse<Exam[]>> {
    const url = this.resourceUrl + `/getMessage/` + type;
    return this.http.get<Exam[]>(url , {params: queryParams, observe: 'response'})
    .pipe(map((res: HttpResponse<Exam[]>) => this.convertDateArrayFromServer(res)));
  }

  public updateExamInfo(param: any) {
    const url = `${this.resourceUrl}/saveExamInfo`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }


  queryExamInfo(teacherId: string, queryParams?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/getTeacherExams?teacherId=` + teacherId;
    return this.http.get<HttpResponse<any>>(url, { params: queryParams, observe: 'response' });
  }

  queryExamType(examId: string): Observable<HttpResponse<any[]>> {
    const url = this.examTypeUrl + '/getExamTypeByExamId?examId=' + examId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  public deleteExamInfo(examId: string) {
    const url = `${this.resourceUrl}/deleteExams?examId=` + examId;
    return this.http.delete<any>(url, { observe: 'response' });
  }

  queryTopicsByExamId(examId: string): Observable<HttpResponse<any[]>> {
    const url =  this.topicUrl + '/getSelectTopicByExamId?examId=' + examId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  querySubject(queryParams?: any): Observable<HttpResponse<any[]>> {
    const url = this.subjectUrl + '/getSubjectByCatalogIdAndType';
    return this.http.get<any[]>(url , { params: queryParams , observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  querySubjectToAutoSelect(queryParams?: any): Observable<HttpResponse<any[]>> {
    const url = this.subjectUrl + '/getSubjectIdToAutoSelect';
    return this.http.get<any[]>(url , { params: queryParams , observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  queryTypeAndTopic(examId: string): Observable<HttpResponse<any[]>> {
    const url =  this.topicUrl + '/getTopicAndTypeByExamId?examId=' + examId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }
}

