import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class OrderDetailService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-course-pays');
  }

  queryOrCreateOrder(record: any): Observable<HttpResponse<any>> {
    const copy = this.convertDateFromClient(record);
    return this.http.post<any>(this.resourceUrl + '/query-create-order', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  aliPay(orderId: any) {
    return this.http.get<any>(this.resourceUrl + '/ali-pay/' + orderId, { observe: 'response'});
  }

  wxPay(orderId: any) {
    return this.http.post<any>(this.resourceUrl + '/wx-pay/' + orderId, { observe: 'response'});
  }
  

}

