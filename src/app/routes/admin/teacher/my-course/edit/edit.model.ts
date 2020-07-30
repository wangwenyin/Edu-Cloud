export class Catalog   {
    constructor(
        public id?: string,
        public eduCourseId  ?: string,
        public name ?: string, // 目录名
        public  parentId?: string,	// 父级id
        public	isAudit?: string,	// 是否已审核
        public	isTrial?: string,	// 是否试看
        public	isPublish?: string, // 是否发布
        public  isOk?: string, // 是否关闭(有效) 1有效 0无效
        public	uploadTime?: Date, // 上传时间
        public	orderNum?: number, // 排序号
        public	remark?: string
    ) {}
}
