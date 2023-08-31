import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
}

export interface IUserMOdel extends IUser, Document {}

const userSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<IUserMOdel>('User', userSchema);
