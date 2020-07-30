import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';

const COMPONENTS = [
  ResourceComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ResourceRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    DetailComponent,
    ListComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ResourceModule { }
