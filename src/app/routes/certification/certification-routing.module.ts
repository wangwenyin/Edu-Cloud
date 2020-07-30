import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificationComponent } from './certification.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CertificationComponent, data: { title: '认证'} },
      // 认证列表页
      { path: 'list', component: ListComponent, data: { title: '认证列表页'} },
      // 认证详情页
      { path: 'detail', component: DetailComponent, data: { title: '认证详情页'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificationRoutingModule { }
