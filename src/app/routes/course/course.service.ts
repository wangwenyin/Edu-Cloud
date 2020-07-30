import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends ThsBaseService<any> {
  private educourseclassifies = '';
  private educoursestop8 = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-courses');
    this.educourseclassifies = httpAddressService.EduWebServe + '/edu-course-classifies';
    this.educoursestop8 = httpAddressService.EduWebServe + '/edu-courses/top8';
}

  // 获取教育云课程分类
  geteducourseclassifies () {
    const url = `${this.educourseclassifies}`;
    return this.http.get<any>(url, { observe: 'response' })
    .pipe(catchError(this.handleError<any>('geteducourseclassifies')));
  }
  // 获取分类前8条
  geteducoursestop8(copyParams: any) {
    const url = `${this.educoursestop8}`;
    return this.http.get<any>(url, { params: copyParams, observe: 'response' })
    .pipe(catchError(this.handleError<any>('geteducoursestop4')));
  }

  // 获取课程带图片
  queryCourse (queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.resourceUrl + '-img', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }

  // 恢复/删除课程 -- 需传入用户课程id
  updateIsDelete(id: string, status): Observable<any> {
    return this.http.put(this.resourceUrl + '/delete/' + id + '/' + status, {})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  // 发布课程
  updateIsPublish(id: string, status: any): Observable<any>  {
    return this.http.put(this.resourceUrl + '/updateIsPublish/' + id + '/' + status, {})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

    /** POST: 添加一条新记录 */
  createCourse (record: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<any>(this.resourceUrl + '/create' , copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for module consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ModuleService message with the MessageService */
  private log(message: string) {
    // this.messageService.info('ModuleService: ' + message);
    console.log('indexService: ' + message);
  }
}
