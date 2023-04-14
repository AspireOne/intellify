import {DocumentType, getModelForClass, prop, Severity} from '@typegoose/typegoose';
import {OfferId, OfferType} from "../schemas/offers";
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
    @prop({default: null})
    public emailVerified!: boolean | null
    @prop()
    public image?: string
    // "Free" tokens (for example from one time token purchase) and subscription tokens are separate so that subscription tokens
    // can be reset every month.
    @prop({default: 1500})
    public remainingFreeTokens?: number
    @prop({})
    public remainingSubscriptionTokens?: number

    @prop({ type: () => Object, allowMixed: Severity.ALLOW })
    subscription?: { id: OfferId, stripeId: string, updatedAt: Date, cancelled?: boolean }
    public async decreaseTokensAndSave(this: DocumentType<User>, tokens: number) {
        if (!this.subscription) {
            if (!this.remainingFreeTokens) this.remainingFreeTokens = -tokens;
            else this.remainingFreeTokens -= tokens;
            await this.save();
            return;
        }

        if (this.remainingSubscriptionTokens && this.remainingSubscriptionTokens >= tokens) {
            this.remainingSubscriptionTokens -= tokens;
            await this.save();
            return;
        }

        if (this.remainingFreeTokens) {
            this.remainingFreeTokens -= (tokens - (this.remainingSubscriptionTokens ?? 0));
        } else {
            this.remainingFreeTokens = -tokens;
        }
        this.remainingSubscriptionTokens = 0;
        await this.save();
    }

    public async getTotalTokens(this: DocumentType<User>): Promise<number> {
        return (this.remainingFreeTokens ?? 0) + (this.remainingSubscriptionTokens ?? 0);
    }

    public async addFreeTokensAndSave(this: DocumentType<User>, tokens: number) {
        if (this.remainingFreeTokens) this.remainingFreeTokens += tokens;
        else this.remainingFreeTokens = tokens;
        await this.save();
    }

    public async removeSubscriptionAndSave(this: DocumentType<User>) {
        this.subscription = undefined;
        this.remainingSubscriptionTokens = 0;
        await this.save();
    }
    public async setSubscriptionAndSave(this: DocumentType<User>, id: OfferId, stripeId: string) {
        const offer = Object.values(offers).find(offer => offer.id === id);
        if (!offer) throw new Error("Offer not found based on passed offer type.");

        if (offer.type == OfferType.ONETIME) throw new Error("The provided offer is onetime, not subscription.");

        this.remainingSubscriptionTokens = offer.tokens;
        this.subscription = {
            id: offer.id,
            stripeId: stripeId,
            updatedAt: new Date()
        };
        await this.save();
    }

    public async refillSubscriptionAndSave(this: DocumentType<User>) {
        if (!this.subscription) throw new Error("Subscription not found.");

        for (const offer of Object.values(offers)) {
            if (offer.id !== this.subscription.id) break;

            this.remainingSubscriptionTokens = offer.tokens;
            await this.save();
            return;
        }

        throw new Error("Subscription not found.");
    }


}

export default getModelForClass(User);