export class News   {
    constructor(
        public id?: string,
        public eduUserId?: string,
        public title?: string,
        public content?: string,
        public sender?: string,
        public sendTime?: string,
        public receiver?: string,
        public readTime?: string,
        public isRead?: string,
        public type?: string,
        public headImg?: string,
        public name?: string,
        public entityId?: string,
        public entityType?: string
    ) {}
}
