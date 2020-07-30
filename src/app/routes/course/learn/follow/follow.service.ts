import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Follow } from './follow.model';

@Injectable({ providedIn: 'root' })
export class FollowService extends ThsBaseService<Follow> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-user-follows');
  }

  // 关注老师
  followTeacher(record: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<any>(this.resourceUrl + '/add', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  // 取消关注
  removeFollow(followUserId: string, userId?: string): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/remove/${followUserId}`;
    return this.http.delete<HttpResponse<any>>(url, {observe: 'response'});
 }

 // 是否关注
 isHasFollow(followUserId: string) {
    return this.http.get<any>(this.resourceUrl + '/has/' + followUserId, {});
  }

}
