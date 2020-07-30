import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CertExamineService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-cert-examine-times');
  }

  queryByDistinctSubject(queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.resourceUrl + '/distinct-subject', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }

  queryByDistinctProduct(queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.resourceUrl + '/distinct-product', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
  }

  queryGrade (queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.resourceUrl + '-grade', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
}

}
