import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { NzMessageService } from 'ng-zorro-antd';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';

@Injectable({ providedIn: 'root' })
export class HomeworkResultService extends ThsBaseService<any> {
  constructor(
     http: HttpClient,
     httpAddressService: HttpAddressService,
  ) {
    super(http, httpAddressService.EduServe + '/edu-study-hm-results');
  }

  submitEduStudyHmResult(param: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(this.resourceUrl + '/submit', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }




}
