import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Info } from './info.model';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({ providedIn: 'root' })
export class InformationService extends ThsBaseService<Info> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-courses');
  }
}

