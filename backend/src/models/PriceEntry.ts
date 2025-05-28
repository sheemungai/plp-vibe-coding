import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceEntry extends Document {
    productName: string;
    supplierName: string;
    price: number;
    date: Date;
}

const PriceEntrySchema: Schema = new Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    supplierName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export default mongoose.model<IPriceEntry>('PriceEntry', PriceEntrySchema); 