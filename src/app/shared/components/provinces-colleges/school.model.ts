export class School {
    public id?: any;
    public name?: string;
    public level?: string;
    public parentId?: string;
    public isOk?: boolean;
    public orderNum?: number;
    public remark?: string;
    constructor(
         id?: any,
         name?: string,
         level?: string,
         parentId?: string,
         isOk?: boolean,
         orderNum?: number,
         remark?: string
    ) {
        this.id = id ? id : null;
        this.name = name ? name : null;
        this.level = level ? level : null;
        this.parentId = parentId ? parentId : null;
        this.orderNum = orderNum ? orderNum : null;
        this.isOk = isOk ? isOk : null;
        this.remark = remark ? remark : null;
    }
}
