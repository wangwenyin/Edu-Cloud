import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
 private resourceUrl = '';
 private courseResourceUrl = '';
 private coursetype = '';
  constructor(
    private http: HttpClient,
    private httpAddressService: HttpAddressService,
    private messageService: NzMessageService
  ) {
    this.courseResourceUrl = this.httpAddressService.EduWebServe + '/edu-courses-img';
    this.coursetype = this.httpAddressService.EduWebServe + '/edu-Coursecifily';
    this.resourceUrl = this.httpAddressService.EduWebServe + '/edu-Coursecifilylist';
  }
  // 根据分类id获取课程及课程下的目录
  // findTreeByParentID(parentID: string):  Observable<HttpResponse<CourseType[]>> {
  //   const url = `${this.resourceUrl}/findTreeByParentID/${parentID}`;
  //   return this.http.get<CourseType[]>(url).pipe(
  //       tap(_ => this.log(`findTreeByParentID`)),
  //       catchError(this.handleError<any>('findTreeByParentID'))
  //     );
  // }
  // 通过分类获取课程数据
  findPageByCourseId(params?: any): Observable<HttpResponse<any>> {
    const url = `${this.courseResourceUrl}`;
    return this.http.get<any>(url, { params: params, observe: 'response' }).pipe(
      tap(_ => this.log(`findPageByCourseId`)),
      catchError(this.handleError<any>('findPageByCourseId'))
    );
  }
  findPageByCoursetype(cifilyid?: any) {
    const url = `${this.coursetype}/${cifilyid}`;
    return this.http.get<any>(url, { observe: 'response' }).pipe(
      tap(_ => this.log(`findPageByCoursetype`)),
      catchError(this.handleError<any>('findPageByCoursetype'))
    );
  }

  getcourselist(cifilyid: string, cifilytype: string) {
    const url = `${this.resourceUrl}/${cifilyid}/${cifilytype}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('getanswerlist')));
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
    // console.log('indexService: ' + message);
  }
}
