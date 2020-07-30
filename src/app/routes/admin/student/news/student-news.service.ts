import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { News } from './student-news.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class StudentNewsService extends ThsBaseService<News> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-user-messages');
  }

  queryNews(type: any, queryParams ?: any): Observable<HttpResponse<News[]>> {
    const url = this.resourceUrl + `/getMessage/` + type;
    return this.http.get<News[]>(url , {params: queryParams, observe: 'response'})
    .pipe(map((res: HttpResponse<News[]>) => this.convertDateArrayFromServer(res)));
  }

  updateIsRead(id: string): Observable<any> {
    const url = this.resourceUrl + `/updateIsRead/` + id;
    return this.http.put(url, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }
}

