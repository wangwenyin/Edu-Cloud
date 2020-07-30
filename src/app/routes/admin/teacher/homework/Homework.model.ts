export class Homework   {
    constructor(
        public id?: string,
        public eduCourseId?: string,
        public eduCatalogId?: string,
        public homeworkName?: string,
        public homeworkHours?: number,
        public totalScore?: string,
        public isOk?: string,
        public isPublic?: string,
        public subjectCount?: string,
    ) {}
}
