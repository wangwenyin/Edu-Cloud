import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { map } from 'rxjs/operators';
import { CertificationUser } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationUserService extends ThsBaseService<CertificationUser> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-cert-users');
  }

  // edu-cert-users-pay
  queryPay (queryParams ?: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '-pay', {params: queryParams ,  observe: 'response'});
}
}
