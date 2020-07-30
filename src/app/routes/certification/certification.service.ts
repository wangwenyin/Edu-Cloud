import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { map } from 'rxjs/operators';
import { Certification } from './certification.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationService extends ThsBaseService<Certification> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
    super(http, httpAddressService.EduWebServe + '/edu-certification-channels');
}

}
