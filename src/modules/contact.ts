import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    userId: string;
    name: string;
    email: string;
    phone: string;
}

const ContactSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

export default mongoose.model<IContact>('Contact', ContactSchema);
