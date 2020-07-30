import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import { SimplemdeModule } from 'ngx-simplemde';
import { FileUploadComponent } from "./components/fileUpload/fileUpload.component";
import { ThsMonenyInputComponent } from './components/moneyInput/moneyInput.component';
import { DictComponent } from './components/dict/dict.component';
import { ThsCollegesSelectComponent } from './components/provinces-colleges/provincesColleges.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ThsHeadImgComponent } from './components/head-img/headImg.component';

const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  UEditorModule,
  NgxTinymceModule,
  PdfViewerModule,
  SimplemdeModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [
  FileUploadComponent,
  ThsMonenyInputComponent,
  DictComponent,
  ThsCollegesSelectComponent,
  ThsHeadImgComponent,
  NoDataComponent
];

const COMPONENTS_NOROUNT = [
  DictComponent
];
const DIRECTIVES = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  entryComponents:[COMPONENTS_NOROUNT]
})
export class SharedModule {}
