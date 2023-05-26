
import mongoose from "mongoose";

const Schema = mongoose.Schema
export const HouseSchema = new Schema(
    {
        bedrooms: {type: Number, required: true},
        bathrooms: {type: Number, required: true},
        yearBuild: {type: Number, required: true},
        price: {type: Number, required: true},
        imgUrl: {type: String, required: true, default:'//placehold.it/300x300'},
        description: {type: String, required: true, maxLength: 500},
        creatorId: {type: Schema.Types.ObjectId, required: true}
    },
    {timestamp: true}
)

