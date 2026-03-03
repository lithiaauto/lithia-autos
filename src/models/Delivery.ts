import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDelivery extends Document {
    clientName: string;
    location: string;
    image: string;
}

const DeliverySchema: Schema = new Schema({
    clientName: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true }
}, {
    timestamps: true
});

const Delivery: Model<IDelivery> = mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);

export default Delivery;
