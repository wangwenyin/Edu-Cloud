import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { School } from './school.model';
import { Observable } from 'rxjs';
import { createRequestOption } from '@shared/utils/request-util';
import { ThsBaseService } from '../thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
    resourceUrl =  '';
    webResourceUrl  = '';
    constructor(private http: HttpClient, httpAddressService: HttpAddressService) {
        this.resourceUrl = httpAddressService.EduServe + `/edu-schools`;
        this.webResourceUrl = httpAddressService.EduWebServe + `/edu-schools`;
    }

    // create(school: School): Observable<HttpResponse<School>> {
    //     return this.http.post<School>(this.resourceUrl, school, { observe: 'response' });
    // }

    // update(school: School): Observable<HttpResponse<School>> {
    //     return this.http.put<School>(this.resourceUrl, school, { observe: 'response' });
    // }

    find(id: string): Observable<HttpResponse<School>> {
        return this.http.get<School>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<HttpResponse<School[]>> {
        const options = createRequestOption(req);
        console.log(this.http.head)
        return this.http.get<School[]>(this.webResourceUrl, { params: options, observe: 'response' });
    }

     queryTree(): Observable<HttpResponse<any>> {
        return this.http.get<any>(this.webResourceUrl + '/tree', {});
    }
    // _query(req?: any): Observable<HttpResponse<any>> {
    //     //const options = createRequestOption(req);
    //     return this.http.get<School>(`/thsedu-xq/api/web/edu-schools/1`, { observe: 'response' });

    // // delete(id: string): Observable<HttpResponse<any>> {
    // //     return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    //  }
}
