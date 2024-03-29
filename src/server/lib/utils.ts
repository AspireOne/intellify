import {CreateChatCompletionRequest, CreateCompletionRequest} from "openai";
import {TRPCError} from "@trpc/server";
import {Context} from "../context";
import User from "../mongodb_models/User";
import {getOffers} from "../resolvers/offers";
import {OfferId} from "../schemas/offers";

export default class Utils {
    public static async getOffer(id: OfferId | string) {
        const offer = Object.values(await getOffers()).find((offer) => offer.id === id);
        if (!offer) throw new Error("Offer id doesn't exist.");
        return offer;
    }

    // Generate order id. 10 digit number.
    public static generateOrderId() {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }
}