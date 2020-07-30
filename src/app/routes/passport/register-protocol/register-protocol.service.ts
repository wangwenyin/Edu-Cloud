import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class RegisterProtocolService extends ThsBaseService<any> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduWebServe + '/edu-agreements');
  }

}

