import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpAddressService } from '@shared/session/http-address.service';
import { User } from './user.model';
import { createRequestOption } from '@shared/utils/request-util';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService extends ThsBaseService<User>{
  // resourceUrl = '/thsadmin/api/org-personnels';
  lobUrl = '';
  private userurl = '';
  private teacherlist = '';
  private studentsurl = '';
  private hmResultUrl = '';
  private courseExamResultUrl = '';
  private homeworkUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-courses');
    this.lobUrl = httpAddressService.EduServe + '/edu-lob-data';
    this.userurl = httpAddressService.EduServe + '/edu-users';
    this.teacherlist = httpAddressService.EduServe + '/edu-teachers';
    this.studentsurl = httpAddressService.EduServe + '/edu-students';
    this.hmResultUrl = httpAddressService.EduServe + '/edu-study-hm-results';
    this.courseExamResultUrl = httpAddressService.EduServe + '/edu-exam-results';
    this.homeworkUrl = httpAddressService.EduServe + '/edu-homeworks';
  }
  queryCourse(studentId: string, courseStatus: string, keyWord: string, queryParams?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/edu-studentCourses?studentId=` + studentId + '&courseStatus=' + courseStatus + '&keyWord=' + keyWord;
    return this.http.get<HttpResponse<any>>(url, { params: queryParams, observe: 'response' });
  }

  queryCourseResult( queryParams?: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.courseExamResultUrl , { params: queryParams, observe: 'response' })
    .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)));
  }

  queryFavoriteCourse(userId: string, courseName: string, queryParams?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/edu-stuFavoriteCourses?userId=` + userId + '&courseName=' + courseName;
    return this.http.get<HttpResponse<any>>(url, { params: queryParams, observe: 'response' });
  }
  public updateTeacherData(param: any) {
    const url = `${this.resourceUrl}/updateData`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  public getImg(queryParams?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.lobUrl, { params: queryParams, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }
  // 获取前端页面的用户登信息
  getentityuser(id: string) {
    const userurl = `${this.userurl}/${id}`;
    return this.http.get<any>(userurl).pipe(catchError(this.handleError<any>('getentityuser')));
  }
  /**
* 查询出讲师信息
* @param operation
* @param result
*/
  getentteacher(id: string) {
    const teacherurl = `${this.teacherlist}/${id}`;
    return this.http.get<any>(teacherurl).pipe(catchError(this.handleError<any>('getentteacher')));
  }
  /**
   * 查询出学生信息
   * @param operation
   * @param result
   */
  getstudents(id: string) {
    const teacherurl = `${this.studentsurl}/${id}`;
    return this.http.get<any>(teacherurl).pipe(catchError(this.handleError<any>('getentteacher')));
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
    // this.messageService.info('CourseListByTypeService: ' + message);
    console.log('CourseListByTypeService: ' + message);
  }

  queryHomeResult( queryParams?: any): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.hmResultUrl + '/studentHmResult', { params: queryParams, observe: 'response' });
  }


}
