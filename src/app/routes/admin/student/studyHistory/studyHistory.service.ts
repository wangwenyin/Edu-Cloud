import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class StudyHistoryService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-study-histories');
  }

  queryStudentHistory(studentId: string, queryParams ?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/getStudyHistory?studentId=` + studentId;
    return this.http.get<HttpResponse<any>>(url , {params: queryParams, observe: 'response'});
  }
}

