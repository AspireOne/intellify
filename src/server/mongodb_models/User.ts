import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';
import {OfferId} from "../schemas/offers";
import {offers} from "../resolvers/offers";

class User {
    @prop({maxlength: [255, "Jméno je příliš dlouhé."]})
    public name?: string
    @prop({
        required: [true, "Email je povinné pole."],
        maxlength: [255, "Email je příliš dlouhý."],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email není platný."]
    })
    public email!: string
    @prop()
    public password?: string
    @prop({required: true, default: false})
    public emailVerified!: boolean
    @prop()
    public image?: string
    // "Free" tokens (for example from one time token purchase) and subscription tokens are separate so that subscription tokens
    // can be reset every month.
    @prop({required: true, default: 0})
    public remainingFreeTokens!: number

    @prop({ type: () => Object })
    subscription?: { type: OfferId, remainingTokens: number, subscribeDate: Date }
    public async decreaseTokensAndSave(this: DocumentType<User>, tokens: number) {
        if (!this.subscription) {
            this.remainingFreeTokens -= tokens;
            await this.save();
            return;
        }

        if (this.subscription.remainingTokens >= tokens) {
            this.subscription.remainingTokens -= tokens;
            await this.save();
            return;
        }

        this.remainingFreeTokens -= (tokens - this.subscription.remainingTokens);
        this.subscription.remainingTokens = 0;
        await this.save();
    }

    public async getTotalTokens(this: DocumentType<User>) {
        return this.remainingFreeTokens + (this.subscription?.remainingTokens ?? 0);
    }

    public async addFreeTokensAndSave(this: DocumentType<User>, tokens: number) {
        this.remainingFreeTokens += tokens;
        await this.save();
    }

    public async refillSubscriptionAndSave(this: DocumentType<User>) {
        if (!this.subscription) throw new Error("Subscription not found.");

        for (const offer of Object.values(offers)) {
            if (offer.id !== this.subscription.type) break;

            this.subscription.remainingTokens = offer.tokens;
            await this.save();
            return;
        }

        throw new Error("Subscription not found.");
    }


}

export default getModelForClass(User);