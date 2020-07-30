import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ThsBaseService } from '@shared/components/thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AccountService extends ThsBaseService<any> {
  lobUrl = '';
  constructor(http: HttpClient, httpAddressService: HttpAddressService) {
      super(http, httpAddressService.EduServe + '/edu-teachers');
      this.lobUrl = httpAddressService.EduServe + '/edu-lob-data';
  }

  public getTeacherData(id: string) {
    const url = `${this.resourceUrl}/getTeacherData/${id}`;
    return this.http.get<any>(url, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  public updateTeacherData(param: any) {
    const url = `${this.resourceUrl}/updateData`;
    const copy = this.convertDateFromClient(param);
    return this.http.post<any>(url, copy, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)));
  }

  public getImg(queryParams ?: any): Observable<HttpResponse<any[]>> {
        return this.http.get<any[]>(this.lobUrl, {params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)));
    }

}

