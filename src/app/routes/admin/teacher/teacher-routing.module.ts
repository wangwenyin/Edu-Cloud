import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { HomeworkComponent } from './homework/homework.component';
import { ExamineComponent } from './examine/examine.component';
import { AccountComponent } from './account/account.component';
import { NewsComponent } from './news/news.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { HmAndEmViewDetailComponent } from './my-course/hmAndEmView/hmemview.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'my-course', data: { title: '个人中心'} },
      { path: 'my-course', loadChildren: './my-course/my-course.module#MyCourseModule', data: { title: '个人中心'} },
      { path: 'question-bank', component: QuestionBankComponent , data: { title: '个人中心'}},
      { path: 'homework', component: HomeworkComponent , data: { title: '个人中心'}},
      { path: 'examine', component: ExamineComponent , data: { title: '个人中心'}},
      { path: 'account', component: AccountComponent , data: { title: '个人中心'}},
      { path: 'news', component: NewsComponent , data: { title: '个人中心'}},
      { path: 'recovery', component: RecoveryComponent , data: { title: '个人中心'}},
      { path: 'hmandemview', component: HmAndEmViewDetailComponent , data: { title: '个人中心'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
