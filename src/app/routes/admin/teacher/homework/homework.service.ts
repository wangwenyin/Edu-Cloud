import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import {Homework  } from './homework.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class HomeworkService extends ThsBaseService<any> {
  courseUrl = '';
  catalogUrl = '';
  homeworkTypeUrl = '';
  subjectUrl = '';
  topicUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-homeworks');
      this.courseUrl = httpAddressService.EduServe + '/edu-courses';
      this.catalogUrl = httpAddressService.EduServe + '/edu-course-catalogs';
      this. homeworkTypeUrl =  httpAddressService.EduServe + '/edu-homework-types';
      this.subjectUrl = httpAddressService.EduServe + '/edu-subjects';
      this.topicUrl = httpAddressService.EduServe + '/edu-homework-topics';
  }


  queryCourse(teacherId: string): Observable<HttpResponse<any[]>> {
    const url = this.courseUrl + '/getCourseByTeacherId?teacherId=' + teacherId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  queryCatalog(courseId: string): Observable<HttpResponse<any[]>> {
    const url = this.catalogUrl + '/getCatalogByCourseId?courseId=' + courseId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  queryHomeworkInfo(teacherId: string, queryParams?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/getHomeworkByteacherId?teacherId=` + teacherId;
    return this.http.get<HttpResponse<any>>(url, { params: queryParams, observe: 'response' });
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


  queryTopicsByHomeworkId(homeworkId: string): Observable<HttpResponse<any[]>> {
    const url =  this.topicUrl + '/getSelectTopicByHomeworkId?homeworkId=' + homeworkId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  public deleteHomeworkInfo(homeworkId: string) {
    const url = `${this.resourceUrl}/deleteHomeworkInfo?homeworkId=` + homeworkId;
    return this.http.delete<any>(url, { observe: 'response' });
  }



   queryExam(type: any, queryParams ?: any): Observable<HttpResponse<Homework[]>> {
    const url = this.resourceUrl + `/getMessage/` + type;
    return this.http.get<Homework[]>(url , {params: queryParams, observe: 'response'})
    .pipe(map((res: HttpResponse<Homework[]>) => this.convertDateArrayFromServer(res)));
  }

  public updateExamInfo(param: any) {
    const url = `${this.resourceUrl}/saveHomeworkInfo`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  queryHomeworkType(homeworkId: string): Observable<HttpResponse<any[]>> {
    const url =  this.homeworkTypeUrl + '/getHomeworkTypeByHomeworkId?homeworkId=' + homeworkId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  queryHomeworkTypeAndTopic(homeworkId: string): Observable<HttpResponse<any[]>> {
    const url =  this.topicUrl + '/getTopicAndTypeByHomeworkId?homeworkId=' + homeworkId;
    return this.http.get<any[]>(url , { observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  downloadHomework(homeworkId: string | number): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/downloadHomework?homeworkId=` + homeworkId;
    return this.http.request('get', url, { observe: 'response'});
  }
}

