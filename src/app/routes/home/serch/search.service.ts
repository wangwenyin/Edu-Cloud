import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private courseResourceUrl = '';
  constructor(
    private http: HttpClient,
    private httpAddressService: HttpAddressService,
    private messageService: NzMessageService
  ) { 
    this.courseResourceUrl = this.httpAddressService.EduWebServe + '/edu-courses-img';
  }


  searchContent(params?: any): Observable<HttpResponse<any>> {
    const url = `${this.courseResourceUrl}`;
    return this.http.get<any>(url, { params: params, observe: 'response' }).pipe(
      tap(_ => this.log(`findPageByCourseId`)),
      catchError(this.handleError<any>('findPageByCourseId'))
    );
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
    console.log('CourseTypeService: ' + message);
  }
}
