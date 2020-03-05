import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ISite extends mongoose.Document {
    name: string;
    uptimeId: number;
    url: string;
    createDatetime: number;
    Account:number;
    NotificationGroup:string;
    status: number;
    lastlog: number;
    ssl_monitored: boolean;
    ssl_issuer: string;
    ssl_subject: string;
    ssl_algo: string;
    ssl_expireDatetime: number;
    ssl_error: string;
    screenshot_url: string;
    screenshot_dateTime: number;
    screenshot_error: string;
    lighthouse_url: string;
    lighthouse_performance: number;
    lighthouse_accessibility: number;
    lighthouse_bestPractices: number;
    lighthouse_seo: number;
    lighthouse_pwa: number;
    lighthouse_dateTime: number;
}

export const SiteSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name'
    },
    uptimeId : {
        type : Number,
    },
    url : {
        type: String,
        required: 'Enter an url'
    },
    createDatetime: {
        type: Number,
        required: 'Enter a timestamp date'
    },
    Account: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Accounts' 
    },
    NotificationGroup:{
        type:mongoose.Schema.Types.ObjectId
    },
    status: { 
        type: Number,
        required: 'Enter a status'
    },
    lastlog: { 
        type: Number,
    },
    ssl_monitored: {
        type: Boolean,
    },
    ssl_issuer: {
        type: String,
    },
    ssl_subject: {
        type: String,
    },
    ssl_algo: {
        type: String,
    },
    ssl_expireDatetime: {
        type: Number,
    },
    ssl_error: {
        type: String,
    },
    screenshot_url: {
        type: String,
    },
    screenshot_dateTime: {
        type: Number,
    },
    screenshot_error: {
        type: String,
    },
    lighthouse_url: {
        type: String,
    },
    lighthouse_performance: {
        type: Number,
    },
    lighthouse_accessibility: {
        type: Number,
    },
    lighthouse_bestPractices: {
        type: Number,
    },
    lighthouse_seo: {
        type: Number,
    },
    lighthouse_pwa: {
        type: Number,
    },
    lighthouse_dateTime: {
        type: Number,
    }
});

