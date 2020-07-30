import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpecialCourse } from './special-course.model';
@Injectable({ providedIn: 'root' })
export class SpecialCourseService extends ThsBaseService<SpecialCourse> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-course-allow-students');
  }

  querySpecialCourse(queryParams ?: any): Observable<HttpResponse<SpecialCourse[]>> {
    return this.http.get<SpecialCourse[]>(this.resourceUrl + '/special', {params: queryParams ,  observe: 'response'})
    .pipe(map((res: HttpResponse<SpecialCourse[]>) => this.convertDateArrayFromServer(res)));
}
}
