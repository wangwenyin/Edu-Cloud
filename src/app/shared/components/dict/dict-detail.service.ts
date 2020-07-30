import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DictDetail } from './dictDetail.model';
import { Observable } from 'rxjs';
import { createRequestOption } from '@shared/utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class DictDetailService {

  private resourceUrl = '/thsadmin/api/sys-dict-details';

    constructor(private http: HttpClient) { }

    create(dictDetail: DictDetail): Observable<HttpResponse<DictDetail>> {
        return this.http.post<DictDetail>(this.resourceUrl, dictDetail, { observe: 'response' });
    }

    update(dictDetail: DictDetail): Observable<HttpResponse<DictDetail>> {
        return this.http.put<DictDetail>(this.resourceUrl, dictDetail, { observe: 'response' });
    }

    find(id: string): Observable<HttpResponse<DictDetail>> {
        return this.http.get<DictDetail>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<DictDetail[]>> {
        return this.http.get<DictDetail[]>(this.resourceUrl, { params: req, observe: 'response' });
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findListByParentId(parentId: string): Observable<HttpResponse<DictDetail[]>> {
      const param: any = {};
      param['parentId.equals'] = parentId;
      param['isOk.equals'] = '1';
      param['sort'] = 'orderNum,asc';
      return this.query(param);
    }

    findListByParentIdList(parentId: any): Observable<HttpResponse<DictDetail[]>> {
      const param: any = {};
      param['parentId.in'] = parentId;
      param['isOk.equals'] = '1';
      param['sort'] = 'orderNum,asc';
      return this.query(param);
    }

    /**
     * 字典拷贝方法
     * @param multiTenancyId 
     * @param params 
     */
    copy(params : any): Observable<HttpResponse<DictDetail>> {
      return this.http.put<DictDetail>(`${this.resourceUrl}/copy`, params, { observe: 'response' });
    }
}
