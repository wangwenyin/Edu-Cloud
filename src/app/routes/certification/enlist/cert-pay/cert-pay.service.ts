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
export class CertPayService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduServe + '/edu-cert-regedist-pays');
  }

  aliPay(orderId: any) {
    return this.http.get<any>(this.resourceUrl + '/ali-pay/' + orderId, { observe: 'response'});
  }

  wxPay(orderId: any) {
    return this.http.post<any>(this.resourceUrl + '/wx-pay/' + orderId, { observe: 'response'});
  }


}
