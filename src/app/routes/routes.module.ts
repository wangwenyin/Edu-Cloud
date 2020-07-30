import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { RegisterProtocolComponent } from './passport/register-protocol/register-protocol.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { HomeComponent } from './home/home.component';
// import { AdminComponent } from './admin/admin.component';
import { DetailComponent } from './course/detail/detail.component';
import { LearnComponent } from './course/learn/learn.component';
import { EvaluateModalComponent } from './course/learn/evaluate-modal/evaluate-modal.component';
import { BindComponent } from './passport/bind/bind.component';
import { FindPwdComponent } from './passport/find-pwd/find-pwd.component';
import { CourseModule } from './course/course.module';
import { ResourceModule } from './resource/resource.module';
import { CertificationModule } from './certification/certification.module';
import { AdminModule } from './admin/admin.module';
import { SerchComponent } from './home/serch/serch.component';

const COMPONENTS = [
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  RegisterProtocolComponent,
  BindComponent,
  FindPwdComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  HomeComponent,
  DetailComponent,
  LearnComponent,
  SerchComponent,
  // AdminComponent,
];
const COMPONENTS_NOROUNT = [
  EvaluateModalComponent,
];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, CourseModule , ResourceModule, CertificationModule , AdminModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
