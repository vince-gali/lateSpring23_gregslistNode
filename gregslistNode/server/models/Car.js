// NOTE mongoose is my 'translator' between our JavaScript class (model) and my database Schema (model)
import mongoose from "mongoose";
const Schema = mongoose.Schema

export const CarSchema = new Schema(
    {
        model: { type: String, required: true, minLength: 3 },
        make: { type: String, required: true },
        year: { type: Number, required: true },
        leaksOil: { type: Boolean, default: false },
        engineType: { type: String, enum: ['8 Cylinder', '6 Cylinder', 'EV'], required: true },
        description: { type: String, required: true, maxLength: 500 },
        creatorId: { type: Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
)