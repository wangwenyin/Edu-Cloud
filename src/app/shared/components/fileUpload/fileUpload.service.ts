import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { FileUpload } from './fileUpload.model';
import {ThsBaseService } from "@shared/components/thsBaseService";

@Injectable({ providedIn: 'root' })
export class FileUploadService extends ThsBaseService<FileUpload> {
  constructor(http: HttpClient) {
      super(http, `/thsadmin/api/sys-files`);
  }

  /** GET: 根据ID获取某一记录 */
  downloadById(id: string | number): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/download/${id}`;
    return this.http.request('get', url, { observe: 'response' ,responseType:'blob'});
  }

  readablizeBytes(bytes) {
    var s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes)/Math.log(1024));
    return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
  }

  deleteAllByFk(fk: string): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/fileFk/${fk}`;
    return this.http.delete<HttpResponse<any>>(url, { observe: 'response'});
  }

  updateFkBatch(oldFk: string, newFk: string): Observable<HttpResponse<any>> {
    const url = `${this.resourceUrl}/updateFkBatch?oldFk=${oldFk}&newFk=${newFk}`;
    return this.http.post<HttpResponse<any>>(url,  { observe: 'response'});
  }
}

