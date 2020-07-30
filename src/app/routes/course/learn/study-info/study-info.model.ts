export class StudyInfo {
    constructor(
        public id?: string,
        public eduCourseId  ?: string,
        public eduCatalogId  ?: string,
        public remark   ?: string,
        public eduStudentId?: string,
        public totalCatalogs?: number,
        public studyCatalogs?: number,
        public studyHours?: number,
        public studyNumbers?: number,
        public classDownloads?: number,
        public studyStartTime?: Date,
        public studyEndTime?: Date,
        public createdBy?: string,
        public createdDate?: Date,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Date
    ) {}
}
