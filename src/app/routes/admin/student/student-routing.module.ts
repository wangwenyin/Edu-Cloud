import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentAccountComponent } from './account/account.component';
import { StudentCourseComponent } from './my-course/my-course.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { MyCourseDetailComponent } from './my-course/detail/detail.component';
import { StudentNewsComponent } from './news/student-news.component';
import { StudyHistoryComponent } from './studyHistory/studyHistory.component';
import { SpecialCourseComponent } from './special-course/special-course.component';
import {HomeworkDetailComponent  } from './my-course/homeworkDetail/homeworkDetail.component';
import { ExamDetailComponent } from './my-course/examDetail/examDetail.component';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'my-course', data: { title: '个人中心'} },
      { path: 'my-course', component: StudentCourseComponent , data: { title: '我的课程'}},
      { path: 'special-course', component: SpecialCourseComponent , data: { title: '专题课程'}},
      { path: 'my-course/detail', component: MyCourseDetailComponent, data: { title: '课程详情'} },
      { path: 'courseFavorite', component: FavoriteComponent  },
      { path: 'my-course-favorite', component: FavoriteComponent },
      { path: 'account', component: StudentAccountComponent , data: { title: '账号信息'} },
      { path: 'student-account', component: StudentAccountComponent, data: { title: '我的账号'} },
      { path: 'news', component: StudentNewsComponent , data: { title: '我的消息'} },
      { path: 'studyHistory', component: StudyHistoryComponent , data: { title: '学习历史'} },
      { path: 'my-course/homeworkDetail', component: HomeworkDetailComponent , data: { title: '作业详情'} },
      { path: 'my-course/examDetail', component: ExamDetailComponent , data: { title: '考试详情'} }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
}