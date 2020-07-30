import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCourseComponent } from './my-course.component';
import { CourseClassComponent } from './class/class.component';
import { CourseInfoComponent } from './info/info.component';
import { AnswerDetailsComponent } from './answer/details/details.component';
import { CourseAnswerComponent } from './answer/answer.component';

const routes: Routes = [
  { path: '', component: MyCourseComponent },
  { path: 'class', component: CourseClassComponent , data: { title: '个人中心' }},
  { path: 'info', component: CourseInfoComponent , data: { title: '个人中心' }},
  { path: 'answerDetail', component: AnswerDetailsComponent , data: { title: '个人中心' }},
  { path: 'answer', component: CourseAnswerComponent , data: { title: '个人中心' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCourseRoutingModule { }
