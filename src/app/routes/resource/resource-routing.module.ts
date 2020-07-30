import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceComponent } from './resource.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ResourceComponent, data: { title: '资源'} },
      //资源列表页
      { path: 'list', component: ListComponent, data: { title: '资源列表页'} },
      //资源详情页
      { path: 'detail', component: DetailComponent, data: { title: '资源详情页'} },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
