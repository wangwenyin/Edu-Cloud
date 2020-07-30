import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CertificationRoutingModule } from './certification-routing.module';
import { CertificationComponent } from './certification.component';
import { DetailComponent } from './detail/detail.component';
 import { ListComponent } from './list/list.component';
import { CertificationService } from './certification.service';
import { EnlistComponent } from './enlist/enlist.component';
import { CertExamineService } from './enlist/examine.service';
import { CertPayComponent } from './enlist/cert-pay/cert-pay.component';

const COMPONENTS = [
  CertificationComponent
];
const COMPONENTS_NOROUNT = [
  EnlistComponent,
  CertPayComponent
];

@NgModule({
  imports: [
    SharedModule,
    CertificationRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    DetailComponent,
     ListComponent,
  ],
  providers: [
    CertificationService,
    CertExamineService
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class CertificationModule { }
