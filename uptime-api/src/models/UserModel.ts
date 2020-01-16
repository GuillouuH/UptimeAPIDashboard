import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
    username: string;
    email:string;
    password:string;
    createdAt:string;
}

export const UserSchema = new Schema({
    username: {
        type: String,
        required: 'Enter an username'
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: 'Enter an account password'
    },
    createdAt: {
        type: Date,
        required: 'Enter an account createdAt',
        default: Date.now()
    }
});