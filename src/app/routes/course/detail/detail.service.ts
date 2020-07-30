import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private courseResourceUrl = '';
  private teacherlist = '';
  private urlCourseListTree = '';
  private courseFavoritesUrl = '';
  constructor(
    private http: HttpClient,
    private httpAddressService: HttpAddressService,
    private messageService: NzMessageService
  ) {
    this.courseResourceUrl = this.httpAddressService.EduWebServe + '/edu-courses';
    this.teacherlist = this.httpAddressService.EduWebServe + '/edu-teachers';
    this.urlCourseListTree = this.httpAddressService.EduWebServe + '/edu-course-catalogs';
    this.courseFavoritesUrl = this.httpAddressService.EduServe + '/edu-course-favorites';
   }

/**
   *
   * @param CourseId 根据课程ID获取课程基本信息
   */
  getCourseInfolist(Id: string) {
    const url = `${this.courseResourceUrl}/course/${Id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('getCourseInfolist')));
  }
  /**
   * 查询出讲师信息
   * @param operation
   * @param result
   */
  getTeacherPartData(id: string) {
    const teacherurl = `${this.teacherlist}/part/${id}`;
    return this.http.get<any>(teacherurl).pipe(catchError(this.handleError<any>('getTeacherPartData')));
  }
/**
   *查询章节树
   *
   * @memberof CourseShowInfoService
   */
  getCourselisttree (params: any) {
    const urltre = `${this.urlCourseListTree}/tree`;
    return this.http.get<any>(urltre, { params: params, observe: 'response' }).pipe(catchError(this.handleError<any>('getCourselist')));
  }
  /**
   * 添加收藏
   * @param operation
   * @param result
   */
  getcollection(roder: any) {
    return this.http.post<any>(this.courseFavoritesUrl, roder, { params: roder, observe: 'response' })
    .pipe(catchError(this.handleError<any>('getevaluationlist')));
  }


  /**
   * 添加收藏
   * @param courseId
   */
  addFavorite(courseId: string) {
    return this.http.post<any>(this.courseFavoritesUrl + '/add/' + courseId, {})
    .pipe(catchError(this.handleError<any>('addFavorite')));
  }


    /**
   * 取消收藏
   * @param courseId
   */
  removeFavorite(courseId: string) {
    return this.http.post<any>(this.courseFavoritesUrl + '/remove/' + courseId, {})
    .pipe(catchError(this.handleError<any>('removeFavorite')));
  }

  /**
   * 是否收藏
   * @param courseId
   */
  isHasFavorite(courseId: string) {
    return this.http.get<any>(this.courseFavoritesUrl + '/has/' + courseId, {})
    .pipe(catchError(this.handleError<any>('removeFavorite')));
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
