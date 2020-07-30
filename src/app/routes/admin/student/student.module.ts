import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StudentRoutingModule } from './student-routing.module';
import { StudentAccountComponent } from './account/account.component';
import { StudentCourseComponent } from './my-course/my-course.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { StudentNewsComponent } from './news/student-news.component';
import { StudyHistoryComponent } from './studyHistory/studyHistory.component';
import { MyCourseDetailComponent } from './my-course/detail/detail.component';
import { SpecialCourseComponent } from './special-course/special-course.component';
import {HomeworkDetailComponent  } from './my-course/homeworkDetail/homeworkDetail.component';
import { ExamDetailComponent } from './my-course/examDetail/examDetail.component';
// import { MyCourseComponent } from './my-course/my-course.component';

const COMPONENTS = [
  StudentAccountComponent,
  FavoriteComponent,
  StudentCourseComponent,
  StudentNewsComponent,
  StudyHistoryComponent,
  MyCourseDetailComponent,
  SpecialCourseComponent,
  HomeworkDetailComponent,
  ExamDetailComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    StudentRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class StudentModule { }
