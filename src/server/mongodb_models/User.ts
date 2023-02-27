import { prop, getModelForClass } from '@typegoose/typegoose';
import {Offers, Plans} from "../schemas/offers";

class User {
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

    @prop()
    public password?: string

    @prop({required: false})
    public image?: string

    @prop({required: true, default: 0})
    public remainingTokens!: number

    @prop({enum: Offers})
    public plan?: string
}

export default getModelForClass(User);