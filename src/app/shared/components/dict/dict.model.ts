export class Dict {
    public id?: any;
    public dictName?: string;
    public dictNo?: string;
    public dictDesc?: string;
    public orderNum?: number;
    public isOk?: boolean;
    public remark?: string;
    constructor(
        id?: any,
        dictName?: string,
        dictNo?: string,
        dictDesc?: string,
        orderNum?: number,
        isOk?: boolean,
        remark?: string
    ) {
        this.id = id ? id : null;
        this.dictName = dictName ? dictName : null;
        this.dictNo = dictNo ? dictNo : null;
        this.dictDesc = dictDesc ? dictDesc : null;
        this.orderNum = orderNum ? orderNum : null;
        this.isOk = isOk ? isOk : null;
        this.remark = remark ? remark : null;
    }
}
