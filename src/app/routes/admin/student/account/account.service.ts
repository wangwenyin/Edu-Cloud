import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class StuAccountService extends ThsBaseService<any> {
  lobUrl = '';
  discussionUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-students');
      this.lobUrl = httpAddressService.EduServe + '/edu-lob-data';
      this.discussionUrl = httpAddressService.EduServe + '/edu-topic-replies';
  }

  public getStudentInfo(id: string) {
    const url = `${this.resourceUrl}/getStudentInfo/${id}`;
    return this.http.get<any>(url, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  public updateStudentInfo(param: any) {
    const url = `${this.resourceUrl}/updateStudentInfo`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  public getImg(queryParams ?: any): Observable<HttpResponse<any[]>> {
        return this.http.get<any[]>(this.lobUrl, {params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
    }


    public getStudentDiscussion(userId: string) {
      const url = this.discussionUrl + `/getAllStudyHistory/${userId}`;
      return this.http.get<any>(url, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
    }


}

