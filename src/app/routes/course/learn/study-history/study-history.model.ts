export class StudyHistory {
    constructor(
        public id?: string,
        public eduCourseId  ?: string,
        public eduCatalogId  ?: string,
        public remark   ?: string,
        public eduStudentId?: string,
        public studyHours?: number,
        public studyTime?: Date,
        public createdBy?: string,
        public createdDate?: Date,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Date
    ) {}

}
