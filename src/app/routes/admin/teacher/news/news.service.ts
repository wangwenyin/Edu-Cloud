import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { News } from './news.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class NewsService extends ThsBaseService<News> {
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

  // 查询消息数量
  countNews(isRead: string): Observable<any> {
    const url = this.resourceUrl + `/countMessage/` + isRead;
    return this.http.get<any>(url , {});
  }
}

