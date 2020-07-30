import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Evaluate } from './Evaluate.model';
import {ThsBaseService } from '@shared/components/thsBaseService';
import { HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({ providedIn: 'root' })
export class EvaluateService extends ThsBaseService<Evaluate> {
  url = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-course-students');
      this.url = httpAddressService.EduServe;
  }

  queryEvaluate(courseId: string, queryParams ?: any): Observable<HttpResponse<any>> {
    const url = this.url + `/edu-course-students/getCourseEvaluate/` + courseId;
    return this.http.get<HttpResponse<any>>(url , {params: queryParams, observe: 'response'});
  }

}

