export class QuestionBank   {
    constructor(
        public id?: string,
        public eduCourseId?: string,
        public eduCatalogId?: string,
        public subjectNo?: string,
        public subjectType?: string,
        public subjectDifficulty?: string,
        public subjectSupplyer?: string,
        public subjectTitle?: string,
        public subjectDescription?: string,
        public isPublic?: string,
        public isOk?: string,
        public isAllowExtract?: string,
        public subjectSource?: string,
        public rightOptions?: string,
        public options?: QuestionOption[]
    ) {}
}

export class QuestionOption   {
    constructor(
        public id?: string,
        public eduCourseId?: string,
        public eduCatalogId?: string,
        public eduSubjectId?: string,
        public subjectType?: string,
        public optionPrefixContent?: string,
        public optionContent?: string,
        public fileId?: string,
        public isRightAnswer?: string
    ) {}
}
