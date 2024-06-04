import { checkMatchingPass } from "./database";

export class User{
    username: string;

    constructor(username:string){
        this.username = username;
    }

    public validateCredentials(password:string){
        return checkMatchingPass(this.username,password);
    }

}