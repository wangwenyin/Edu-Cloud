import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LobDataService } from '@shared/components/lobData/lobData.service';
import {NgxEchartsModule} from 'ngx-echarts';
const COMPONENTS = [
  AdminComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgxEchartsModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  providers: [
     LobDataService
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class AdminModule { }
