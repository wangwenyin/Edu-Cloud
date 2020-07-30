import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { RegisterProtocolComponent } from './passport/register-protocol/register-protocol.component';
import { BindComponent } from './passport/bind/bind.component';
import { FindPwdComponent } from './passport/find-pwd/find-pwd.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { HomeComponent } from './home/home.component';
import { LayoutAdminComponent } from 'app/layout/admin/admin.component';
import { LayoutCommonComponent } from 'app/layout/common/common.component';
import { DetailComponent } from './course/detail/detail.component';
import { LearnComponent } from './course/learn/learn.component';
import { SerchComponent } from './home/serch/serch.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      // { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      // 课程模块
      { path: 'course', loadChildren: './course/course.module#CourseModule', data: { title: '课程' } },
      // // 认证模块
      // { path: 'certification', loadChildren: './certification/certification.module#CertificationModule', data: { title: '认证' } },
      // 资源模块
      { path: 'resource', loadChildren: './resource/resource.module#ResourceModule', data: { title: '资源' } },
      { path: 'routes/home/search', component: SerchComponent , data: { title: '搜索' }} // 课程首页搜索
    ]
  },
  // 用户管理中心(老师和学生)
  {
    path: 'admin',
    component: LayoutAdminComponent, loadChildren: './admin/admin.module#AdminModule', data: { title: '个人中心' }
    // children: [
    //   { path: '', loadChildren: './admin/admin.module#AdminModule', data: { title: '个人中心' } },
    //   // { path: 'student', loadChildren: './admin/admin.module#AdminModule', data: { title: '个人中心' } },
    //   // { path: '',  },
    // ]
  },
  //  // 我的收藏
  //  {
  //   path: 'student/courseFavorite',
  //   component: LayoutAdminComponent,
  //   children: [
  //     { path: '', redirectTo: 'courseFavorite', pathMatch: 'full' },
  //     { path: 'courseFavorite', loadChildren: './stuAdmin/admin.module#AdminModule', data: { title: '我的收藏' } },
  //   ]
  // },
  // // 账号信息
  // {
  //   path: 'student/account',
  //   component: LayoutAdminComponent,
  //   children: [
  //     { path: '', redirectTo: 'studentAccount', pathMatch: 'full' },
  //     { path: 'studentAccount', loadChildren: './stuAdmin/admin.module#AdminModule', data: { title: '账号信息' } },
  //   ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录', titleI18n: '用户登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册', titleI18n: '用户注册' } },
      { path: 'register-protocol', component: RegisterProtocolComponent, data: { title: '注册协议' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果', titleI18n: 'pro-register-result' } },
      { path: 'bind', component: BindComponent, data: { title: '绑定账号' } },
      { path: 'find-pwd', component: FindPwdComponent, data: { title: '找回密码' } }
    ]
  },
  // 套用commonLayout的页面
  {
    path: '',
    component: LayoutCommonComponent,
    children: [
      { path: 'course/detail', component: DetailComponent, data: { title: '课程详情' } }, // 课程详情页
    ]
  },
  // 认证页面，需要重新加载轮播图
  { path: 'certification', component: LayoutDefaultComponent,
   loadChildren: './certification/certification.module#CertificationModule', data: { title: '认证' }
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'dashboard' },
  { path: 'course/learn', component: LearnComponent, data: { title: '课程学习' } }, // 课程学习页
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
