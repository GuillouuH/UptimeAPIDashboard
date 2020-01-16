import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IAccount extends mongoose.Document {
    email: string;
    apiKey:string;
    Type:string;
}

export const AccountSchema = new Schema({
    email: {
        type: String,
        required: 'Enter an e-mail'
    },
    apiKey: {
        type: String,
        required: 'Enter an apiKey'
    },
    Type: {
        type: String,
        required: 'Enter an account type'
    }
});