/*
 * @Author: yuanmh
 * @Date: 2018-08-24 14:21:39
 * @Last Modified by: yuanmh
 * @Last Modified time: 2019-04-11 11:33:03
 */
import { Injectable } from '@angular/core';
/**
 *
 * 应用的缓存
 * @export
 * @class AppSessionService
 */
@Injectable({
  providedIn: 'root'
})
export class AppSessionService {
  /**
   *
   * 项目Id
   * @private
   * @type {string}
   * @memberof AppSessionService
   */
  private _appProjectId: string;

  /**
   * 项目name
   *
   * @private
   * @type {string}
   * @memberof AppSessionService
   */
  private _appProjectName: string;
  /**
   *
   * 项目Id保存Cookie 的key
   * @private
   * @memberof AppSessionService
   */
  private _appProjectIdKey = 'appProjectId';

  constructor() { }
  /**
   *
   * 得到 cookie值
   * @private
   * @param {string} value
   * @returns
   * @memberof AppSessionService
   */
  private getCookie(value: string) {
    const reg = new RegExp('(^| )' + value + '=([^;]*)(;|$)');
    const arr = document.cookie.match(reg);
    return arr[2];
  }
  /**
   *
   * 设置cookie值
   * @private
   * @param {string} key
   * @param {string} value
   * @memberof AppSessionService
   */
  private setCookie(key: string, value: string) {
    document.cookie = key + '=' + value;
  }
  /**
   *
   * 得到项目Id
   * @type {string}
   * @memberof AppSessionService
   */
  get appProjectId(): string {
    return this._appProjectId;
  }
  /**
   * 设置项目Id
   *
   * @memberof AppSessionService
   */
  set appProjectId(value: string) {
    this._appProjectId = value;
  }
  /**
   * 得到用户名
   *
   * @type {string}
   * @memberof AppSessionService
   */
  get appProjectName(): string {
    return this._appProjectName;
  }
  /**
   * 设置用户名
   *
   * @memberof AppSessionService
   */
  set appProjectName(value: string) {
    this._appProjectName = value;
  }
}
