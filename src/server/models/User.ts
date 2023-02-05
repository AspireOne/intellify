import * as mongoose from "mongoose";
import { prop, getModelForClass } from '@typegoose/typegoose';

class UserClass {
    @prop()
    public name?: string

    @prop({
        required: [true, "Email je povinné pole."],
        maxlength: [255, "Email je příliš dlouhý."],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email není platný."]
    })
    public email!: string

    @prop({required: true, default: false})
    public emailVerified!: boolean

    @prop({required: [true, "Heslo je povinné pole."]})
    public password!: string

    @prop({required: false})
    public image?: string
}

export default getModelForClass(UserClass);