export class CertificationUser   {
    constructor(
        public id?: string,
        public  userId?: string,
        public  name?: string,
        public  idCard?: string,
        public  mobile?: string,
        public  authType?: string,
        public  examineSubject?: string,
        public  authProduct?: string,
        public  authGrade?: string,
        public  status?: string,  // 0-未付款  1-待考试  2-待补考  3-已拿证 4-未通过
        // 最后考试时间
        public  examineTime?: Date,
        // 最后报名表id
        public  regedistId?: string,
    ) {}
}


