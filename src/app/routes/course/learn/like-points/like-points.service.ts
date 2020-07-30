import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LikePoints } from './like-points.model';

@Injectable({ providedIn: 'root' })
export class LikePointsService extends ThsBaseService<LikePoints> {
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-topic-like-points');
  }

  deleteByTopicId (id: string): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/delete/${id}`;
    return this.http.delete<HttpResponse<any>>(url, { observe: 'response'});
}

}
