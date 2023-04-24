import {prop, getModelForClass} from '@typegoose/typegoose';

export class ShortenedUrl {
    @prop({ required: true })
    slug!: string;

    @prop({ required: true })
    url!: string;
}

export default getModelForClass(ShortenedUrl, {schemaOptions: {timestamps: true}});