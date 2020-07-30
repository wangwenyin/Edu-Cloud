
export interface IFileUpload {
    id ?: string;
    fileName ?: string;
    fileFk ?: string;
    fileSavePath ?: string;
    fileSize ?: string;
    fileType ?: string;
    fileDesc ?: string;
    downloadCount ?: string;
    uploader ?: string;
    orderNum ?: number; 
    isDelete ?: boolean;
    createdBy ?: string;
    createdDate ?: Date;
    lastModifiedBy ?: string;
    lastModifiedDate ?: Date;
    extField1 ?: string;
    extField2 ?: string;
    extField3 ?: string;
    extField4 ?: string;
    extField5 ?: string;
  }

export class FileUpload implements IFileUpload {
    constructor(
        public id ?: string,
        public fileName ?: string,
        public fileFk ?: string,
        public fileSavePath ?: string,
        public fileSize ?: string,
        public fileType ?: string,
        public fileDesc ?: string,
        public downloadCount ?: string,
        public uploader ?: string,
        public orderNum ?: number, 
        public isDelete ?: boolean,
        public createdBy ?: string,
        public createdDate ?: Date,
        public lastModifiedBy ?: string,
        public lastModifiedDate ?: Date,
        public extField1 ?: string,
        public extField2 ?: string,
        public extField3 ?: string,
        public extField4 ?: string,
        public extField5 ?: string,
    ) {}
}
