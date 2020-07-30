import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { SimpleInterceptor,JWTInterceptor } from '@delon/auth';
// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';
import localeZhHansExtra from '@angular/common/locales/extra/zh-Hans';
registerLocaleData(localeZhHans,'zh-cn', localeZhHansExtra);
registerLocaleData(localeZhHans,'zh-Hans', localeZhHansExtra);

// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';

import { FormsModule } from '@angular/forms';

// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import {DelonACLModule} from "@delon/acl";
//import {UEditorWidget} from "@shared/widgets/ueditor/ueditor.widget";
import {WidgetRegistry} from "@delon/form";
import {NgxTinymceModule} from "ngx-tinymce";
import {UEditorModule} from "ngx-ueditor";
import {SimplemdeModule} from "ngx-simplemde";
import { ServiceToken } from '@shared/tokens/service.token';
import { ServiceFactory } from '@shared/factorys/service.factory';
import { fakeBackendProvider  } from '@core/net/mock.interceptor';
import { HttpAddressService } from '@shared/session/http-address.service';
import { UserService } from './routes/admin/user.service';


// 加载i18n语言文件
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/tmp/i18n/`, '.json');
}

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}
export function get_ApplicationConfig(httpAddressService: HttpAddressService) {
  return () => httpAddressService.getApplicationConfig();
}
@NgModule({
  declarations: [
    AppComponent,
   // UEditorWidget,
  ],
 // entryComponents: [ UEditorWidget ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    DelonACLModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    FormsModule,
    // i18n
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: I18nHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // thirds
    UEditorModule.forRoot({
      // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
      js: [
         `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`,
         `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`,
        //`./assets/ueditor/ueditor.all.min.js`,
        //`./assets/ueditor/ueditor.config.js`,
      ],
      options: {
         UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`,
      //  UEDITOR_HOME_URL: '/assets/ueditor/',
      },
    }),
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
    }),
    SimplemdeModule.forRoot({}),
    // JSON-Schema form
    JsonSchemaModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    //{ provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
    { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    },
    HttpAddressService,
    {
      provide: APP_INITIALIZER,
      useFactory: get_ApplicationConfig,
      deps: [HttpAddressService],
      multi: true
    },
    ServiceFactory,
    { provide: ServiceToken, useClass: UserService, multi: true},

    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  /*constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(UEditorWidget.KEY, UEditorWidget);
  }*/
}
