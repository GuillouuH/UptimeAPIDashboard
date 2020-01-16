import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { SiteSchema, ISite} from '../models/SiteModel';
import { AccountSchema, IAccount } from '../models/AccountModel';
import { LogTypeSchema, ILogType } from '../models/LogTypeModel';
import { LogSchema, ILog } from '../models/LogModel';

import axios from 'axios';
import moment from "moment"

const Site = mongoose.model<ISite>('Sites', SiteSchema, 'Sites');
const Account = mongoose.model<IAccount>('Accounts', AccountSchema, 'Accounts');
const LogType = mongoose.model<ILogType>('LogType', LogTypeSchema, 'LogType');
const Log = mongoose.model<ILog>('Log', LogSchema, 'Log');

export class UpdateDataController{

    uptimeRequest = async (url : any, data : any) => {
        let resp = await axios.post(url, data);
        return resp.data;
    }

    getUptimeData = async (accounts : any, lastlog: any) => {
        let results = [];
        let url = 'https://api.uptimerobot.com/v2/getMonitors';
        for(var i = 0; i<accounts.length; i++){
            let data = {"api_key":accounts[i].apiKey, "logs":1, "logs_start_date":null};
            if(lastlog != "")
                data["logs_start_date"] = lastlog;
            let tmpResult = await this.uptimeRequest(url, data);
            tmpResult.monitors["acountId"] = accounts[i]._id;
            results.push(tmpResult.monitors);
            if(tmpResult.pagination.limit < tmpResult.pagination.total){
                let offset = tmpResult.pagination.limit;
                while(offset < tmpResult.pagination.total){
                    let data = {"api_key":accounts[i].apiKey, "offset":offset, "logs":1, "logs_end_date": moment().format('X'), "logs_start_date":null};
                    if(lastlog != "")
                        data["logs_start_date"] = lastlog + 1;
                    tmpResult = await this.uptimeRequest(url, data);
                    tmpResult.monitors["acountId"] = accounts[i]._id;
                    results.push(tmpResult.monitors);
                    offset = offset + tmpResult.pagination.limit;
                }
            }
        }
        return results;
    }

    public saveAllSites = async () => {
        let vm = this;
        let Accounts = Account.find({}).exec();
        let SitePromises = Site.find({}).exec();
        let LastLogSites = Site.findOne({}).sort('-lastlog').exec();
        let Logtype = LogType.find({}).exec();
        let LogsSave = Log.find({}).exec();
        let newSiteAdd = Array();
        let newLogsAdd = Array();
        let result = {};
        await Promise.all([Accounts, SitePromises, LogsSave, LastLogSites, Logtype]).then(async ([accounts, sites, logsSave, lastlogsites, logtype]) => {
            let firstLog = lastlogsites!.lastlog;
            let allDownDate : any = [];
            if(sites!.length > 0){
                sites!.forEach(element => {
                    if(element.status === 9){
                        allDownDate.push(element.lastlog)
                    }
                });
            }
            if(allDownDate.length > 0){
                firstLog = Math.max.apply(null, allDownDate)
            }
            let uptimeData = await vm.getUptimeData(accounts, firstLog)
            uptimeData.forEach(element => {
                let AccountId = element.acountId;
                element.forEach((element: any) => {
                    let isNewSite = false
                    let newSite : any;
                    let siteConcerned = sites!.find(e => e.uptimeId === element.id);
                    var logs = element.logs
                    let lastlog = 0;
                    if(logs.length > 0){
                        lastlog = logs[0].datetime
                    }
                    if(siteConcerned === undefined){
                        var site = {
                            "name":element.friendly_name,
                            "uptimeId":element.id,
                            "url":element.url,
                            "createDatetime":element.create_datetime,
                            "Account":AccountId,
                            "status":element.status,
                            "lastlog":lastlog
                        }
                        newSiteAdd.push(site)
                        newSite = new Site(site);
                        isNewSite = true
                        newSite.save();
                    } else {
                        Site.findOneAndUpdate({_id:siteConcerned._id}, {$set:{ "name": element.friendly_name, "status":element.status, "lastlog":lastlog}}).exec();
                    }
                    if(logs.length > 0){
                        logs.forEach((logelement: any) => {
                            var siteConcernedId = 0
                            if(isNewSite){
                                siteConcernedId = newSite._id;
                            }else{
                                siteConcerned = sites!.find(x => x.uptimeId === element.id);
                                siteConcernedId = siteConcerned!._id;    
                            }
                            var logtypeConcerned = logtype!.find(x=> x.logTypeId === logelement.type)
                            var logtosave = {
                                "Site":siteConcernedId,
                                "Type":logtypeConcerned!._id,
                                "datetime":logelement.datetime,
                                "duration":logelement.duration,
                                "code":logelement.reason.code,
                                "detail":logelement.reason.detail
                            }
                            if(!isNewSite){
                                let logConcerned = logsSave!.find((e: any) => e.datetime === logtosave.datetime && e.Site == siteConcernedId.toString())
                                if(logConcerned !== undefined) {
                                    Log.findOneAndUpdate({_id:logConcerned._id.toString()}, { "datetime": logtosave.datetime, "duration": logtosave.duration}).exec();    
                                } else {
                                    newLogsAdd.push(logtosave)
                                    let log = new Log(logtosave);
                                    log.save();
                                }
                            } else {
                                newLogsAdd.push(logtosave)
                                let log = new Log(logtosave);
                                log.save();
                            }
                        });
                    }
                });
            });
        }).then(() =>{
            result = {'State':'sucess', 'message': 'Sites and Logs saved successfully', 'site_added':newSiteAdd.length,  'logs_added':newLogsAdd.length, 'sites':newSiteAdd, "update_datetime":moment().format('X')}
        }).catch((error) => {
            result = {'State':'error', 'message': error}
        });

        return result;
    }    
}