import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { ListComponent } from './list/list.component';
import { FollowService } from './learn/follow/follow.service';
import { OrderDetailComponent } from './detail/order-detail/order-detail.component';
import { DetailComponent } from './detail/detail.component';
import { LearnHomeworkComponent } from './learn/homework/homework.component';
import { LearnHomeworkService } from './learn/homework/homework.service';
import { HomeworkTypeService } from './learn/homework/homework-type.service';
import { LearnExamComponent } from './learn/exam/exam.component';
import { ExamPaperComponent } from './learn/exam/paper/paper.component';
import { HomweworkPaperComponent } from './learn/homework/paper/paper.component';
import { HomeworkDetailsService } from './learn/homework/details.service';

const COMPONENTS = [
  CourseComponent,
  ListComponent,
];
const COMPONENTS_NOROUNT = [
  OrderDetailComponent,
  LearnHomeworkComponent,
  LearnExamComponent,
  ExamPaperComponent,
  HomweworkPaperComponent
];

@NgModule({
  imports: [
    SharedModule,
    CourseRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  providers: [
    FollowService,
    HomeworkTypeService,
    HomeworkDetailsService,
    LearnHomeworkService
  ],
  entryComponents: COMPONENTS_NOROUNT,
  // 导出组件使用
  exports: [
    LearnHomeworkComponent,
    LearnExamComponent,
    ExamPaperComponent,
    HomweworkPaperComponent
  ]
})
export class CourseModule { }
