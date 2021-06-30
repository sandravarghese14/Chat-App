
export class User {

    constructor(
        public username: string,
        public email: string,
        public password:string,
        public image:string,
        public contacts:Array<{name:string,isMuted: boolean, isBlocked: boolean}>       
    ) {}
}

