import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';

@Injectable({
  providedIn: 'root'
})
export class LearnService extends ThsBaseService<any> {
  private catalogResource = '';
  private webResource = '';
  private evaluationlist = '';
  private courseTopicUrl = '';
  private topicReplyUrl = '';
  constructor(
     http: HttpClient,
     httpAddressService: HttpAddressService,
    private messageService: NzMessageService
  ) {
    super(http, httpAddressService.EduServe);
    this.webResource = httpAddressService.EduWebServe;
    this.catalogResource = httpAddressService.EduServe + '/edu-course-catalogs';
    this.evaluationlist = httpAddressService.EduServe + '/edu-course-students';
    this.courseTopicUrl = httpAddressService.EduServe + '/edu-topics';
    this.topicReplyUrl = httpAddressService.EduServe + '/edu-topic-replies';
  }

  // 是否能学习课时
  isCanViewCatalog(id: string) {
    const url = `${this.catalogResource}/buy/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('isCanViewCatalog')));
  }




  // 通过课程的id获取课程答疑信息
  readTopicAndTopicReply(param: any) {
    const url = `${this.courseTopicUrl}/readTopic`;
    return this.http.get<any[]>(url, {params: param ,  observe: 'response'});
  }
   /**
   *
   * @param CourseId 根据课程ID获取课程基本信息
   */
  getCourseInfo(CourseId: string) {
    const url = `${this.webResource}/edu-courses/course/${CourseId}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('getCourseInfo')));
  }

  /**
   *查询章节树
   *
   * @memberof
   */
  getCourselist (params: any) {
    const urltre = `${this.webResource}/edu-course-catalogs/tree`;
    return this.http.get<any>(urltre, { params: params, observe: 'response' }).pipe(catchError(this.handleError<any>('getCourselist')));
  }


  // 点赞
  addLikePoint(id: string) {
    const url = `${this.courseTopicUrl}/addLikePoint/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('getCourseInfo')));
  }

  // 取消点赞
  removeLikePoint(id: string) {
    const url = `${this.courseTopicUrl}/removeLikePoint/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError<any>('getCourseInfo')));
  }


  /**
   * 查询出讲师信息
   * @param operation
   * @param result
   */
  getEntityUser(id: string) {
    const teacherurl = `${this.webResource}/edu-teachers/${id}`;
    return this.http.get<any>(teacherurl).pipe(catchError(this.handleError<any>('getentityuser')));
  }

  // 添加答疑
  /**
   * @param record
   */
  saveQuestionList(record: any) {
    return this.http.post<any>(this.courseTopicUrl, record, { params: record, observe: 'response' })
    .pipe(catchError(this.handleError<any>('saveQuestionList')));
  }

 // 子添加答疑
  /**
   * @param record
   */
  saveQuestionReply(record: any) {
    return this.http.post<any>(this.topicReplyUrl, record, { params: record, observe: 'response' })
    .pipe(catchError(this.handleError<any>('saveQuestionReply')));
  }

  /**
   * 添加发布评价的信息
   * @param operation
   * @param result
   */
  getevaluationlist(record: any) {
    return this.http.post<any>(this.evaluationlist, record, { params: record, observe: 'response' })
    .pipe(catchError(this.handleError<any>('getevaluationlist')));
  }

  // 获取答疑信息
  getAnswerList(id: String, param?: any) {
    const url = `${this.courseTopicUrl}/topicList/${id}`;
    // return this.http.get<any>(url, param).pipe(catchError(this.handleError<any>('getanswerlist')));
    return this.http.get<any[]>(url, {params: param ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }


    // 获取答疑信息
  getCatalogAnswerList(id: String, param?: any) {
    const url = `${this.courseTopicUrl}/catalogTopicList/${id}`;
    // return this.http.get<any>(url, param).pipe(catchError(this.handleError<any>('getanswerlist')));
    return this.http.get<any[]>(url, {params: param ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }
 /**
   *查询子评论
   *
   * @memberof
   * 
   */
  gettopicreplies (parentId: string) {
    const urltre = `${this.topicReplyUrl}/conutparentId/${parentId}`;
    // console.log(urltre,'urltreurltre');
    return this.http.get<any>(urltre).pipe(catchError(this.handleError<any>('getanswerlist')));
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

  // 查询课件
  getSystemFiles(){

  }

  /** Log a ModuleService message with the MessageService */
  private log(message: string) {
    // this.messageService.info('ModuleService: ' + message);
    // console.log('indexService: ' + message);
  }
}
