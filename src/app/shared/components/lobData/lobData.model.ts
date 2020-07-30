export class LobData {
    public id?: any;
    public  businessType?: string;
    public  businessId?: string;
    public  lobData?: string;
    public  remark?: string;
    constructor(
        id?: any,
        businessType?: string,
        businessId?: string,
        lobData?: string,
        remark?: string,
    ) {
        this.id = id ? id : null;
        this.businessType = businessType ? businessType : null;
        this.businessId = businessId ? businessId : null;
        this.lobData = lobData ? lobData : null;
        this.remark = remark ? remark : null;
    }
}
