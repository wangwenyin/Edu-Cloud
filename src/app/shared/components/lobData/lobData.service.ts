import { HttpClient, HttpResponse } from '@angular/common/http';
import { LobData } from './lobData.model';
import { Observable } from 'rxjs';
import { ThsBaseService } from '../thsBaseService';
import { HttpAddressService } from '@shared/session/http-address.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LobDataService extends ThsBaseService<LobData> {
    constructor(http: HttpClient, httpAddressService: HttpAddressService) {
        super(http, httpAddressService.EduServe + '/edu-lob-data');
    }

    // // 查lobdata值
    // findByType(type: string): Observable<string> {
    //     const url = `${this.resourceUrl}/getLobData/${type}`;
    //     return this.http.get<string>(url, { observe: 'string'});
    // }


}
