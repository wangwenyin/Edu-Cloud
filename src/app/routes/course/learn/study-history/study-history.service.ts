import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { StudyHistory } from './study-history.model';

@Injectable({ providedIn: 'root' })
export class HistoryDetailsService extends ThsBaseService<StudyHistory> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-study-histories');
  }
      /** POST: 添加一条新记录 */
  createHistory (record: StudyHistory): Observable<HttpResponse<StudyHistory>> {
      const copy = this.convertDateFromClient(record);
      return this.http.post<StudyHistory>(this.resourceUrl + '/create', copy, { observe: 'response'})
      .pipe(map((res: HttpResponse<StudyHistory>) => this.convertDateFromServer(res)));
  }

  /** PUT: 更新某一记录 */
  updateHistory (record: StudyHistory): Observable<any> {
      const copy = this.convertDateFromClient(record);
      return this.http.put(this.resourceUrl + '/update', copy, { observe: 'response'})
      .pipe(map((res: HttpResponse<StudyHistory>) => this.convertDateFromServer(res)));
  }
}
