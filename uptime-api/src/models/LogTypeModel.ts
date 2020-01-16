import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ILogType extends mongoose.Document {
    logTypeId: number;
    logTypeLabel: string;
}

export const LogTypeSchema = new Schema({
    logTypeId: {
        type: Number,
        required: 'Enter an id'
    },
    logTypeLabel: {
        type: String,
        required: 'Enter a label'
    }
});