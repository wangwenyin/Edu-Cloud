import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Catalog } from './edit.model';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CatalogService extends ThsBaseService<Catalog> {
  url = '';
  sysFileUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-course-catalogs');
      this.url = httpAddressService.EduServe;
      this.sysFileUrl = httpAddressService.systemServe;
  }

  queryCatalogAndMsgNum(courseId: string): Observable<any> {
    return this.http.get<any>(this.resourceUrl + '/teacher/' + courseId, {});
  }

  updateSysFile(record: any): Observable<any> {
    const copy = this.convertDateFromClient(record);
    return this.http.put(this.sysFileUrl + '/sys-files', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  updateCatalogDuration(record: any): Observable<any> {
    const copy = this.convertDateFromClient(record);
    return this.http.put(this.resourceUrl + '/duration', copy, { observe: 'response'})
    .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

 }






