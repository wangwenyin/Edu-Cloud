import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({
  providedIn: 'root'
})
export class SysFileService {
  private sysFileUrl = '';
  constructor(
    private http: HttpClient,
    private httpAddressService: HttpAddressService,
  ) {
    this.sysFileUrl = this.httpAddressService.systemServe + '/sys-files';
  }

    /** GET: 分页、多条件查询记录列表 */
  query (queryParams ?: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(this.sysFileUrl, {params: queryParams ,  observe: 'response'});
  }


}
