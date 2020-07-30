import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Summarize } from './summarize.model';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({ providedIn: 'root' })
export class SummarizeService extends ThsBaseService<Summarize> {
  webUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-course-summarizes');
      this.webUrl = httpAddressService.EduWebServe + '/edu-course-summarizes';
  }

  queryByCourseId(courseId: string): Observable<HttpResponse<Summarize[]>> {
    return this.http.get<Summarize[]>(this.webUrl + '/' + courseId, {observe: 'response'})
    .pipe(map((res: HttpResponse<Summarize[]>) => this.removeDateServer(res)));
  }

  query (queryParams ?: any): Observable<HttpResponse<Summarize[]>> {
        return this.http.get<Summarize[]>(this.resourceUrl, {params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<Summarize[]>) => this.removeDateServer(res)));
   }

   create (record: Summarize): Observable<HttpResponse<Summarize>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<Summarize>(this.resourceUrl, copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<Summarize>) => this.removeOneDateServer(res)));
  }

  removeOneDateServer(res: HttpResponse<Summarize>): HttpResponse<Summarize> {
    delete res.body['createdBy'];
    delete res.body['createdDate'];
    delete res.body['lastModifiedBy'];
    delete res.body['lastModifiedDate'];
    return res;
  }

  removeDateServer(res: HttpResponse<Summarize[]>): HttpResponse<Summarize[]> {
    res.body.forEach((record: Summarize) => {
      delete record['createdBy'];
      delete record['createdDate'];
      delete record['lastModifiedBy'];
      delete record['lastModifiedDate'];
        // for(let key in record){       
        //     let value = record[key.toString()];
        //     delete record[];
        //      if(this.isDateOrDateTime(value)){
        //         record[key.toString()] = moment(value).format('YYYY-MM-DD HH:mm:ss');
        //     }
        // }
    });
    return res;
}

  batchUpdate(list: any[]): Observable<any> {
    return this.http.post(this.resourceUrl + '/batchUpdate', list, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
}
}

