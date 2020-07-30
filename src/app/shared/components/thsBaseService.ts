import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


export class ThsBaseService<T> {
    constructor(
        protected http: HttpClient,
        protected resourceUrl: string) {}
    
    regxDateTimeISO = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/i;
    regxDateTimeZone = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+08:00$/i;
    regxDateTime = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/i;
    regxDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}$/i;
        

    /** POST: 添加一条新记录 */
    create (record: T): Observable<HttpResponse<T>> {
        const copy = this.convertDateFromClient(record);
        return this.http.post<T>(this.resourceUrl, copy, { observe: 'response'})
        .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)));
    }

    /** PUT: 更新某一记录 */
    update (record: T): Observable<any> {
        const copy = this.convertDateFromClient(record);
        return this.http.put(this.resourceUrl, copy, { observe: 'response'})
        .pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)));
    }


    
    /** GET: 根据ID获取某一记录 */
     find(id: string|number): Observable<HttpResponse<T>> {
         const url = `${this.resourceUrl}/${id}`;         
         return this.http.get<T>(url, { observe: 'response' }).pipe(map((res: HttpResponse<T>) => this.convertDateFromServer(res)));
     }

    /** GET: 分页、多条件查询记录列表 */
    query (queryParams ?: any): Observable<HttpResponse<T[]>> {
        return this.http.get<T[]>(this.resourceUrl, {params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res)));
    }

    /** GET: 分页、多条件查询记录列表 */
    queryWithIgnoreAuth (queryParams ?: any): Observable<HttpResponse<T[]>> {
        return this.http.get<T[]>(this.resourceUrl, {headers: {"ignoreAuth": "true"},params: queryParams ,  observe: 'response'})
        .pipe(map((res: HttpResponse<T[]>) => this.convertDateArrayFromServer(res)));
    }


    /** DELETE: 根据id、id数组来删除记录 */
    delete (record:  string | string[]): Observable<HttpResponse<any>> {
        let id;
        if(record instanceof Array){
            id =  record.join(",") ;
        }else{
            id = record;
        }
        const url = `${this.resourceUrl}/${id}`;

        return this.http.delete<HttpResponse<any>>(url, { observe: 'response'});
    }

    convertDateFromClient(record: T): T {
        let dateColumn = {};
        for(let key in record){
            let value = record[key.toString()];
            if(this.isDateOrDateTime(value)){
                let newValue = moment(value);
                dateColumn[key.toString()] = newValue != null && newValue.isValid() ? newValue.toJSON() : null;
            }
        }
        const copy: T = Object.assign({}, record, dateColumn);
        return copy;
    }

   convertDateFromServer(res: HttpResponse<T>): HttpResponse<T> {
        for(let key in res.body){
            let value = res.body[key.toString()];
            if(this.isDateOrDateTime(value)){
                res.body[key.toString()] = moment(value).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        return res;
    }

    convertDateArrayFromServer(res: HttpResponse<T[]>): HttpResponse<T[]> {
        res.body.forEach((record: T) => {
            for(let key in record){       
                let value = record[key.toString()];
                 if(this.isDateOrDateTime(value)){
                    record[key.toString()] = moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
            }
        });
        return res;
    }

    isDateOrDateTime(value: any){
        if(value != null && typeof value === 'string' && (this.regxDateTimeZone.test(value) || this.regxDate.test(value) || this.regxDateTime.test(value) || this.regxDateTimeISO.test(value)) ){
            return true;
        }
        return false;
    } 
}