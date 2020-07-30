export class DictDetail {
    public id?: any;
    public itemText?: string;
    public itemValue1?: string;
    public itemValue2?: string;
    public itemValue3?: string;
    public orderNum?: number;
    public isOk?: boolean;
    public parentId?: string;
    public sysDictId?: string;
    public multiTenancyId?: string;
    public isLeaf?: boolean;
    constructor(
        id?: any,
        itemText?: string,
        itemValue1?: string,
        itemValue2?: string,
        itemValue3?: string,
        orderNum?: number,
        isOk?: boolean,
        parentId?: string,
        sysDictId?: string,
        multiTenancyId?: string,
        isLeaf?: boolean
    ) {
        this.id = id ? id : null;
        this.itemText = itemText ? itemText : null;
        this.itemValue1 = itemValue1 ? itemValue1 : null;
        this.itemValue2 = itemValue2 ? itemValue2 : null;
        this.itemValue3 = itemValue3 ? itemValue3 : null;
        this.orderNum = orderNum ? orderNum : null;
        this.isOk = isOk ? isOk : null;
        this.parentId = parentId ? parentId : null;
        this.sysDictId = sysDictId ? sysDictId : null;
        this.multiTenancyId = multiTenancyId ? multiTenancyId : null;
        this.isLeaf = isLeaf ? isLeaf : null;
    }
}
