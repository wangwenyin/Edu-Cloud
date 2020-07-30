import {Injectable} from '@angular/core';
import * as $ from 'jquery';
/**
 *
 * 服务接口地址
 * @export
 * @class HttpAddressService
 */
@Injectable({providedIn: 'root'})
export class  HttpAddressService {

    /**
     *
     * 网关
     * @private
     * @type {string}
     * @memberof HttpAddressService
     */
    private _apiGateway: string;
    /**
     *
     * 认证
     * @private
     * @type {string}
     * @memberof HttpAddressService
     */
    private _authServe: string;
    
    /**
     * 系统管理配置
     */
    private _systemServe:string;

    /**
     * 教育服务配置
     */
    private _eduServe: string;

    /**
     * 教育服务配置
     */
    private _webServe: string;

    /**
     * 工作流配置
     */
    private _workflowServe:string;
    constructor() {

    }
    /**
     *
     * 下载配置文件进行请求地址初始化
     * @returns
     * @memberof HttpAddressService
     */
    getApplicationConfig() {
        const thisClone = this;
        return new Promise((_resolve, _reject) => {
            $.ajax({
                url: '/assets/appconfig.json',
                method: 'GET'
            }).done(result => {
                thisClone._authServe = result.AuthServe;
                thisClone._apiGateway = result.ApiGateway;              
                thisClone._systemServe = result.SystemServe;
                thisClone._eduServe = result.EduServe;
                thisClone._webServe = result.WebServe;
                thisClone._workflowServe = result.WorkflowServe;
                _resolve();
            });
        });
    }
    /**
     *
     * 网关服务地址
     * @readonly
     * @type {string}
     * @memberof HttpAddressService
     */
    get  apiGateway(): string {
        return this._apiGateway;
    }
    /**
     *
     * 认证服务地址
     * @readonly
     * @type {string}
     * @memberof HttpAddressService
     */
    get  authServe(): string {
        return this._authServe;
    }
   
    /**
     * 获取系统服务信息
     * @returns {any}
     */
    get systemServe():any{
      return this._systemServe;
    }

    /**
     * 获取教育服务信息
     */
    get EduServe():any{
        return this._eduServe;
    }

    /**
     * 获取教育门户端服务信息
     */
    get EduWebServe(): any{
        return this._webServe;
    }
 
  /**
   *
   *获取工作流服务地址
   * @readonly
   * @type {*}
   * @memberof HttpAddressService
   */
  get workflowServe():any{
    return this._workflowServe;
  }
}