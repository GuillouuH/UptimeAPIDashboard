import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export interface ILog extends mongoose.Document {
    Site: string;
    Type: string;
    datetime:number;
    duration:number;
    code:number;
    detail: number;
}

export const LogSchema = new Schema({
    Site: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sites' 
    },
    Type: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LogTypes'
    },
    datetime: {
        type: Number,
        required: 'Enter a timestamp date',
        default: 0
    },
    duration: {
        type: Number,
        required: 'Enter a timestamp duration'
    },
    code : {
        type: Number,
        required: 'Enter a duration'
    },
    detail : {
        type: String,
        required: 'Enter a detail'
    }
});