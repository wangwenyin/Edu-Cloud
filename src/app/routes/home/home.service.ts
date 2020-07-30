import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private edubannersurl = '';
  private educourseclassifies = '';
  private educoursestop4 = '';
  private edubannersurllist = '';
  constructor(
    private http: HttpClient,
    private httpAddressService: HttpAddressService,
    private messageService: NzMessageService
  ) {
    this.edubannersurl = this.httpAddressService.EduWebServe + '/edu-banner-img';
    this.educourseclassifies = this.httpAddressService.EduWebServe + '/edu-course-classifies';
    this.educoursestop4 = this.httpAddressService.EduWebServe + '/edu-courses/top4';
    this.edubannersurllist = this.httpAddressService.apiGateway + '/thsadmin/api/sys-files';
  }

  //  查询banner图片的数据
  getbanners(pamms: any) {
    const url = `${this.edubannersurl}`;
    return this.http.get<any>(url, { params: pamms, observe: 'response' }).pipe(catchError(this.handleError<any>('getbanners')));
  }

  // 获取教育云课程分类
  geteducourseclassifies() {
    const url = `${this.educourseclassifies}`;
    return this.http.get<any>(url, { observe: 'response' })
      .pipe(catchError(this.handleError<any>('geteducourseclassifies')));
  }
  // 获取分类前4条
  geteducoursestop4(copyParams: any) {
    const url = `${this.educoursestop4}`;
    return this.http.get<any>(url, { params: copyParams, observe: 'response' })
      .pipe(catchError(this.handleError<any>('geteducoursestop4')));
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
