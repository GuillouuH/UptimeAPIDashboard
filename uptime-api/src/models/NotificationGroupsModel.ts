import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface INotificationGroup extends mongoose.Document {
    name: string,
    cibles: Array<Object>
}

export const NotificationGroupSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name'
    },
    cibles : []
});