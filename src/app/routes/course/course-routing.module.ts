import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course.component';
import { ListComponent } from './list/list.component';
import { LearnHomeworkComponent } from './learn/homework/homework.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CourseComponent },
      // 课程列表页
      { path: 'list', component: ListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
