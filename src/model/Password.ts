
import {format} from "timeago.js";

export interface Password {
    id: string;
    _for: string;
    username: string;
    password: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    //
    // constructor(passwordDTO: PasswordDTO) {
    //     this.id = passwordDTO.id
    //     this.for = passwordDTO.for
    //     this.username = passwordDTO.username
    //     this.password = passwordDTO.password
    //     this.description = passwordDTO.description
    //     this.createdAt = new Date(passwordDTO.createdAt).toDateString()
    //     this.updatedAt = format(new Date(passwordDTO.updatedAt))
    // }
}