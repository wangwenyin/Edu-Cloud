export class Exam   {
    constructor(
        public id?: string,
        public eduCourseId?: string,
        public examTitle?: string,
        public examTimeLength?: string,
        public isStartTimeLimit?: string,
        public examStartTime?: Date,
        public totalScore?: string,
        public isOk?: string,
        public isPublic?: string,
        public subjectCount?: string,
    ) {}
}
