export class Follow   {
    constructor(
        public id?: string,
        public userId  ?: string,
        public followUserId  ?: string,
        public followTime  ?: Date,
    ) {}
}