export class EduCourseCatalogModel {
    id?: string;
    eduCourseId?: string;
    name?: string;
    parentId?: string;
    isAudit?: string;
    isTrial?: string;
    uploadTime?: Date;
    orderNum?: string;
    remark?: string;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;

}

export class EduCourseCatalogTreeNodeModel {
    id?: string;
    eduCourseId?: string;
    name?: string;
    parentId?: string;
    isAudit?: string;
    isTrial?: string;
    uploadTime?: Date;
    orderNum?: string;
    remark?: string;
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;

    label: string; // 树结构Id
    expand: boolean;
    isLeaf: boolean;
    level: number;
    children?: EduCourseCatalogTreeNodeModel[];
}
