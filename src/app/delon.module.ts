/**
 * 进一步对基础模块的导入提炼
 * 有关模块注册指导原则请参考：https://github.com/cipchk/ng-alain/issues/180
 */
import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { throwIfAlreadyLoaded } from '@core/module-import-guard';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule, ReuseTabService, ReuseTabStrategy } from '@delon/abc';
import { DelonAuthModule, DA_STORE_TOKEN, LocalStorageStore } from '@delon/auth';
import { DelonACLModule } from '@delon/acl';
import { DelonCacheModule } from '@delon/cache';
import { DelonUtilModule } from '@delon/util';
// import { AdQRModule } from '@delon/abc';
import { AdQRConfig } from '@delon/abc';


// mock
import { DelonMockModule } from '@delon/mock';
import * as MOCKDATA from '../../_mock';
import { environment } from '@env/environment';
const MOCKMODULE = !environment.production ? [DelonMockModule.forRoot({ data: MOCKDATA })] : [];

// region: global config functions

import { AdPageHeaderConfig } from '@delon/abc';
export function pageHeaderConfig(): AdPageHeaderConfig {
  return Object.assign(new AdPageHeaderConfig(), {
    home_i18n: 'home',
    autoTitle: false,
    autoBreadcrumb: false
  });
}

import { DelonAuthConfig } from '@delon/auth';
export function delonAuthConfig(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/passport/login',
    token_exp_offset: 120,
    ignores: [ /\/login/, /\/web/, /assets\//, /passport\// ]
  });
}

import { AdSimpleTableConfig } from '@delon/abc';
export function fnAdSimpleTableConfig(): AdSimpleTableConfig {
  return Object.assign(new AdSimpleTableConfig(), <AdSimpleTableConfig>{
    bordered: true,
    size: 'small',
    showSizeChanger: true
  });
}

export function fnAdQRConfig(): AdQRConfig {
  return Object.assign(new AdQRConfig(), <AdQRConfig>{
    // values
  });
}

// endregion

@NgModule({
  imports: [
    NgZorroAntdModule.forRoot(),
    AlainThemeModule.forRoot(),
    DelonABCModule.forRoot(),
    DelonAuthModule.forRoot(),
    DelonACLModule.forRoot(),
    DelonCacheModule.forRoot({mode: 'none'}),
    DelonUtilModule.forRoot(),
    // AdQRModule.forRoot()
    // mock
    //...MOCKMODULE,
  ],
})
export class DelonModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DelonModule,
  ) {
    throwIfAlreadyLoaded(parentModule, 'DelonModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [
        // TIPS：若不需要路由复用需要移除以下代码及模板`<reuse-tab></reuse-tab>`
        {
          provide: RouteReuseStrategy,
          useClass: ReuseTabStrategy,
          deps: [ReuseTabService],
        },
        // TIPS：@delon/abc 有大量的全局配置信息，例如设置所有 `simple-table` 的页码默认为 `20` 行
        { provide: AdSimpleTableConfig, useFactory: fnAdSimpleTableConfig },
        { provide: AdPageHeaderConfig, useFactory: pageHeaderConfig },
        { provide: DelonAuthConfig, useFactory: delonAuthConfig },
        // token存储策略
//        LocalStorageStore 关掉浏览器后不丢失(默认)
//        SessionStorageStore 关掉浏览器后丢失
//        MemoryStore 关掉浏览器标签后丢失
        { provide: DA_STORE_TOKEN, useClass: LocalStorageStore },
        { provide: AdQRConfig, useFactory: fnAdQRConfig }
      ],
    };
  }
}
