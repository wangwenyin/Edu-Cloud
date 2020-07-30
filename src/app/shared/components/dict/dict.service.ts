import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Dict } from './dict.model';
import { Observable } from 'rxjs';
import { createRequestOption } from '@shared/utils/request-util';

@Injectable({
  providedIn: 'root'
})
export class DictService {

    private resourceUrl = '/thsadmin/api/sys-dicts';

    constructor(private http: HttpClient) { }

    create(dict: Dict): Observable<HttpResponse<Dict>> {
        return this.http.post<Dict>(this.resourceUrl, dict, { observe: 'response' });
    }

    update(dict: Dict): Observable<HttpResponse<Dict>> {
        return this.http.put<Dict>(this.resourceUrl, dict, { observe: 'response' });
    }

    find(id: string): Observable<HttpResponse<Dict>> {
        return this.http.get<Dict>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<Dict[]>> {
        const options = createRequestOption(req);
        return this.http.get<Dict[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    /**
     * 根据字典类型编码获取字典列表(一级列表)
     * @param dictNo
     */
    findAllByDictNo(dictNo: string): Observable<HttpResponse<any[]>>  {
        const url = this.resourceUrl + '/findAllByDictNo';
        return this.http.get<any>(`${url}/${dictNo}`, { observe: 'response' });
    }

    /**
     * 根据字典类型编码和项目id获取字典列表(一级列表)
     * @param dictNo
     */
    findAllByDictNoAndMultiTenancyId(dictNo: string,multiTenancyId: string): Observable<HttpResponse<any[]>>  {
        const url = this.resourceUrl + '/findAllByDictNoAndMultiTenancyId';
        return this.http.get<any>(`${url}/${dictNo}/${multiTenancyId}`, { observe: 'response' });
    }

    findDictDetailBySysDictId(sysDictId: string): Observable<HttpResponse<any[]>>  {
        const url = '/thsadmin/api/sys-dict-details?sysDictId.equals='+ sysDictId;
        return this.http.get<any>(url, { observe: 'response' });
    }
}
