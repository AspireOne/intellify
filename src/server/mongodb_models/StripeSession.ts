import {prop, getModelForClass} from '@typegoose/typegoose';
import mongoose from "mongoose";
import User from "./User";
import typegoose from '@typegoose/typegoose';

export class StripeSession {
    @prop({ required: true })
    sessionId!: string;

    @prop({ required: true })
    offerId!: string;

    /*
    *
    @prop({ ref: () => User, autopopulate: true, required: true })
    userId!: typegoose.Ref<User>;*/
    // this is fucking stupid but it doesnt work with ref otherwise.
    @prop({ required: true })
    userId!: string;
}

export default getModelForClass(StripeSession, {schemaOptions: {timestamps: true}});