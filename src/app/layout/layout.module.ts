import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutCommonComponent } from './common/common.component';
import { LayoutPassportComponent } from './passport/passport.component';
import { LayoutAdminComponent } from './admin/admin.component';

import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderSearchComponent } from './header/components/search.component';
import { HeaderNotifyComponent } from './header/components/notify.component';
import { HeaderTaskComponent } from './header/components/task.component';
import { HeaderIconComponent } from './header/components/icon.component';
import { HeaderFullScreenComponent } from './header/components/fullscreen.component';
import { HeaderI18nComponent } from './header/components/i18n.component';
import { HeaderStorageComponent } from './header/components/storage.component';
import { HeaderUserComponent } from './header/components/user.component';
import { ChangePwComponent } from './passport1/changePassword/changePassword.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  LayoutAdminComponent,
  LayoutCommonComponent,
  HeaderComponent,
  FooterComponent,
  SidebarComponent
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  ChangePwComponent
];

const PASSPORT = [
  LayoutPassportComponent
];

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT
  ],
  exports: [
    ...COMPONENTS,
    ...PASSPORT
  ],

})
export class LayoutModule { }
