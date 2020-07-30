import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { map } from 'rxjs/operators';
import { CertEnlist } from './enlist.model';

@Injectable({
  providedIn: 'root'
})
export class CertEnlistService extends ThsBaseService<CertEnlist> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-cert-regedists');
  }

  singUp (record: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<any>(this.resourceUrl + '/sign-up', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  isCharge (record: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<any>(this.resourceUrl + '/is-charge', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

}
