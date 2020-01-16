import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AccountTypeSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name'
    }
});