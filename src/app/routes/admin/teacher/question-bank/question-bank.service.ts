import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { QuestionBank, QuestionOption } from './question-bank.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class QuestionBankService extends ThsBaseService<any> {
  courseUrl = '';
  questionOptionUrl = '';
  courseCatalogsUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-subjects');
      this.courseUrl = httpAddressService.EduServe + '/edu-courses';
      this.questionOptionUrl = httpAddressService.EduServe + '/edu-subject-options';
      this.courseCatalogsUrl = httpAddressService.EduServe + '/edu-course-catalogs';
  }

  
  findRecoverySubject(): Observable<HttpResponse<any[]>>  {
    const url = this.resourceUrl + '/recovery';
    return this.http.get<any[]>(url , {observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }

  // 批量设置
  modifyIsAllowExtract(oper: string, ids: string) {
    return this.http.patch(this.resourceUrl + '-extract/' + oper + '/' + ids, {}, {observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  queryCourse(teacherId: string): Observable<HttpResponse<any[]>> {
    const url = this.courseUrl + '/getCourseByTeacherId?teacherId=' + teacherId;
    return this.http.get<any[]>(url , {observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => (res)));
  }


  querySubject (queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.resourceUrl + '/teacher', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
}


  queryCourseCatalogs(queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.courseCatalogsUrl, {params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }

  updateQuestionInfo(param: any) {
    let url = '';
    if (param.id != null && param.id !== '') {
      url = `${this.resourceUrl}/updateQuestionInfo`;
    } else {
      url = `${this.resourceUrl}/saveQuestionInfo`;
    }
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }


  saveQuestionInfo(param: any) {
    const url = `${this.resourceUrl}-save`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  modifyQuestionInfo(param: any) {
    const url = `${this.resourceUrl}-update`;
    const copy = this.convertDateFromClient(param);
    return this.http.put<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  querySubjectsInfo(teacherId: string, queryParams?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/getTeacherSubjects?teacherId=` + teacherId;
    return this.http.get<HttpResponse<any>>(url, { params: queryParams, observe: 'response' });
  }


  // 放入回收站
  recycleQuestionInfo(ids: string) {
    const url = `${this.resourceUrl}-recycle/` + ids;
    return this.http.delete<any>(url, {observe: 'response' });
  }


  // 删除
  deleteQuestionInfo(ids: string) {
    const url = `${this.resourceUrl}-batch/` + ids;
    return this.http.delete<any>(url, {observe: 'response' });
  }


  // 恢复
  recoveryQuestionInfo(ids: string) {
      const url = `${this.resourceUrl}-recovery/` + ids;
      return this.http.patch<any>(url, {}, {observe: 'response' });
    }

  // 导出
  export(type: string, ids: string) {
    const url = `${this.resourceUrl}/export/${type}/${ids}`;
    return this.http.post<HttpResponse<any>>(url, {observe: 'response'});
  }

  findAllByDictNo(dictNo: string): Observable<HttpResponse<any[]>>  {
    const dictUrl = '/thsadmin/api/sys-dicts';
    const url = dictUrl + '/findAllByDictNo';
    return this.http.get<any>(`${url}/${dictNo}`, { observe: 'response' });
  }

  queryQuestionOption(queryParams ?: any): Observable<HttpResponse<QuestionOption[]>> {
    return this.http.get<QuestionOption[]>(this.questionOptionUrl, {params: queryParams ,  observe: 'response'});
        // .pipe(map((res: HttpResponse<QuestionOption[]>) => this.convertDateArrayFromServer(res)));
  }



}

