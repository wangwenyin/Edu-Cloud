import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MyCourseRoutingModule } from './my-course-routing.module';
import { ClassService } from './class/class.service';
import { CourseClassComponent } from './class/class.component';
import { MyCourseComponent } from './my-course.component';
import { CourseEvaluateComponent } from './evaluate/evaluate.component';
import { CourseInfoComponent } from './info/info.component';
import { EvaluateService } from './evaluate/evaluate.service';
import { CourseEditComponent } from './edit/edit.component';
import { TokenService } from '@delon/auth';
import { AccountService } from '../account/account.service';
import { CourseAnswerComponent } from './answer/answer.component';
import { AnswerDetailsComponent } from './answer/details/details.component';
const COMPONENTS = [
  CourseClassComponent,
  MyCourseComponent,
  AnswerDetailsComponent
];

const COMPONENTS_NOROUNT = [
  CourseEvaluateComponent,
  CourseInfoComponent,
  CourseEditComponent,
  CourseAnswerComponent,

];

@NgModule({
  imports: [
    SharedModule,
    MyCourseRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  providers: [
    ClassService,
    EvaluateService,
    AccountService
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class MyCourseModule { }
