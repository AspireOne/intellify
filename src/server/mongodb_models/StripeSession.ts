// Create a typegoose model for StripeSession containing sessionId, userId, offerId.

import {getModelForClass, prop} from "@typegoose/typegoose";
import {OfferId, OfferType} from "../schemas/offers";

class StripeSession {
    @prop({required: true})
    public sessionId!: string;
    @prop({required: true})
    public userId!: string
    @prop({required: true, type: String })
    public offerId!: OfferId
}

export default getModelForClass(StripeSession, {schemaOptions: {timestamps: true}});