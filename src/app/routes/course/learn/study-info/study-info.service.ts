import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { StudyInfo } from './study-info.model';

@Injectable({ providedIn: 'root' })
export class StudyInfoService extends ThsBaseService<StudyInfo> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-study-infos');
  }

  // 添加或者更新
  updateOrSave (record: StudyInfo): Observable<any> {
      const copy = this.convertDateFromClient(record);
      return this.http.put(this.resourceUrl + '/update', copy, { observe: 'response'})
      .pipe(map((res: HttpResponse<StudyInfo>) => this.convertDateFromServer(res)));
  }

}
