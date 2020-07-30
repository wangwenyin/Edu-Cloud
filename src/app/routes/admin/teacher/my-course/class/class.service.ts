import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Class } from './class.model';
import {ThsBaseService } from '@shared/components/thsBaseService';
import { HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({ providedIn: 'root' })
export class ClassService extends ThsBaseService<Class> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe);
  }

  queryClass(courseId: string, queryParams ?: any): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/edu-courses/getClassStuAndHmexResultByCourseId?courseId=` + courseId;
    return this.http.get<HttpResponse<any>>(url , {params: queryParams, observe: 'response'});
  }

}

