import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { RecoveryComponent } from './recovery/recovery.component';
import { NewsComponent } from './news/news.component';
import { AccountComponent } from './account/account.component';
import { NewsService } from './news/news.service';
import { AccountService } from './account/account.service';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { HomeworkComponent } from './homework/homework.component';
import { AddWorkComponent } from './homework/add-work/add-work.component';
import {SelectSubjectComponent  } from './homework/selectSubject/selectSubject.component';
import {PriviewWorkComponent  } from './homework/homeworkPreview/priview-work.component';
import { ExamineComponent } from './examine/examine.component';
import { AddExamComponent } from './examine/add-exam/add-exam.component';
import { ExamineService } from './examine/examine.service';
import { SelectExamSubjectComponent } from './examine/selectExamSubject/selectExamSubject.component';
import { PriviewExamComponent } from './examine/examPreview/priview-exam.component';
import { AddQuestionComponent } from './question-bank/add-question/add-question.component';
import { HmAndEmViewDetailComponent  } from './my-course/hmAndEmView/hmemview.component';
import { NewsListComponent } from './news/list/list.component';

const COMPONENTS = [
  QuestionBankComponent,
  HomeworkComponent,
  ExamineComponent,
  AccountComponent,
  NewsComponent,
  RecoveryComponent,
];
const COMPONENTS_NOROUNT = [
  AddWorkComponent,
  AddExamComponent,
  AddQuestionComponent,
  SelectSubjectComponent,
  PriviewWorkComponent,
  SelectExamSubjectComponent,
  PriviewExamComponent,
  HmAndEmViewDetailComponent,
  NewsListComponent
];

@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  providers: [
    NewsService,
    AccountService,
    ExamineService
  ], exports: [
    NewsListComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class TeacherModule { }
