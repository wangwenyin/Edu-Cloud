import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class WebService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduWebServe);
  }

  updatePasswordByMobile(param: any) {
    const copy = this.convertDateFromClient(param);
    return this.http.patch(this.resourceUrl + '/update-password', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  sendSMSCode(mobile: string) {
    return this.http.post<any>(this.resourceUrl + '/sendSMSCode/' + mobile, { observe: 'response'});
  }

}

