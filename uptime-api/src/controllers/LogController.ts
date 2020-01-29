import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { SiteSchema, ISite } from '../models/SiteModel';
import { LogSchema, ILog } from '../models/LogModel';
import { AccountTypeSchema } from '../models/AccountTypeModel';
import { LogTypeSchema, ILogType } from '../models/LogTypeModel';

//import * as moment from 'moment/moment';
import  moment from 'moment-timezone';

const Log = mongoose.model<ILog>('Log', LogSchema);
const Site = mongoose.model<ISite>('Sites', SiteSchema);
const AccountType = mongoose.model('typeaccount', AccountTypeSchema);
const LogType = mongoose.model<ILogType>('logtype', LogTypeSchema);

export class LogController{
    public deleteLogs(req: Request, res: Response){
        let DeleteAllLogs = Log.deleteMany({}).exec();
        DeleteAllLogs.then(function () {
            let data = {'State':'success', 'Message':'All logs deleted successfully'}
            res.json(data)
        });
    }


    // Update log with Take Into Account

    public async takeIntoAccountLog(req: Request, res: Response){
        let array_logs = req.body.data;
        
        let all_promise : any = []
        array_logs.forEach(async (e : any) => {
            all_promise.push(Log.findOneAndUpdate({_id : e.id}, { comment: e.comment, takeIntoAccount: e.takeIntoAccount }).exec())            
        });

        try {
            await Promise.all(all_promise);
            res.json({message : "Update"});
        } catch(err) {
            res.send({ message: "Error" });
        }

    }


    // Update logs With new model

    public async updateLogs(req: Request, res: Response){
        try {
            await Log.updateMany({}, { comment: "", takeIntoAccount: true });
            res.json({message : "Update"});
        } catch (err) {
            res.send({ message: "Error" });
        }
    }

    // Get all logs
    public getLogs(req: Request, res: Response) {
        Log.find({}, (err, logs) => {
            if(err)
                res.send(err);
            res.json(logs);
        }).populate('Site').populate('Type');
    }

    public deleteduplicatelogs(req: Request, res: Response){
        Log.find({Site: mongoose.Types.ObjectId('5d39cf6fa7f30900062f4f00')}, (err, logs) => {
            if(err)
                res.send(err);

            let logArray:any = {};
            let goodLogs = Array();
            let duplicateLogs = Array();
            let duplicateLogsToKeep = Array();
            let duplicateLogsToRemove = Array();

            logs.forEach(element => {
                let key = element.datetime;
                if(!logArray.hasOwnProperty(key)){
                    logArray[key] = Array();
                }
                logArray[key].push(element);
            });


            Object.keys(logArray).forEach(function(key) {
                if(logArray[key].length === 1)
                    goodLogs.push(logArray[key])
                else
                    duplicateLogs.push(logArray[key]);
            });
            
            duplicateLogs.forEach(element => {
                element = element.sort((a:any,b:any) => (a.duration > b.duration) ? 1 : (b.duration  > a.duration) ? -1 : 0);
            })
            
            duplicateLogs.forEach(element => {
                for(let i = 0; i < element.length; i++){
                    if(i === 0){
                        duplicateLogsToKeep.push(element[i]._id);
                    } else {
                        duplicateLogsToRemove.push(mongoose.Types.ObjectId(element[i]._id));
                    }
                }
            });
            //console.log(106082 - duplicateLogsToRemove.length)
            Log.deleteMany({_id : { $in: duplicateLogsToRemove}}, () => {
                res.json({"message":"Delete done!"})
            });
        }).lean();
    }

    // Get log pour un intervalle donné
    public async getLogInIntervalle(Site:string, start:number, end:number, logTypeDown:Array<any>, allLogType:Array<any>, downPauseType:Array<any>){
        let LogsRequest = Log.find(
            {
                Site : { $eq: Site}, 
                datetime:{$lte:end, $gte:start}
            }, 
            {},
            {
                sort:{datetime:-1}
            }
        ).lean().exec();

        let LastLogRequest = Log.findOne(
            {
                Site : { $eq: Site}, 
                datetime:{$lte:start}
            }, 
            {},
            {
                sort:{datetime:-1}
            }
        ).lean().exec();
        
        try {
            let logArray : any = [];
            await Promise.all([LogsRequest, LastLogRequest]).then(async ([logrequest, lastlogrequest])=>{
                for(var i = 0; i < logrequest.length; i++){
                    if(logTypeDown.indexOf(logrequest[i].Type.toString()) > -1) {
                        let tmpLog = {
                            "_id":logrequest[i]._id,
                            "site":logrequest[i].Site,
                            "datetime":logrequest[i].datetime,
                            "duration":logrequest[i].duration,
                            "reason":{"code":logrequest[i].code,"detail":logrequest[i].detail},
                            "type":allLogType[logrequest[i].Type],
                            "comment":logrequest[i].comment,
                            "takeIntoAccount":logrequest[i].takeIntoAccount
                        }
                        logArray.push(tmpLog)
                    }
                }
                
                if(logArray.length === 0){      
                    if(lastlogrequest !== null && Object.entries(lastlogrequest).length > 0  && downPauseType.indexOf(lastlogrequest.Type.toString()) > -1){
                        let tmpLog = {
                            "_id":lastlogrequest._id,
                            "site":lastlogrequest.Site,
                            "datetime":lastlogrequest.datetime,
                            "duration":lastlogrequest.duration,
                            "reason":{"code":lastlogrequest.code,"detail":lastlogrequest.detail},
                            "type":allLogType[lastlogrequest.Type],
                            "comment":lastlogrequest.comment,
                            "takeIntoAccount":lastlogrequest.takeIntoAccount
                        }
                        logArray = [tmpLog]
                    }
                }
            },reason => {
                console.log(reason)
            })
            
            return logArray;
        } catch(e){
            console.log(e)
        }

    }

    // Get logs for each Sites
    public getLogsBySites = async (req: Request, res: Response) => {
        const { site, ranges, custom_days_range = Array(), custom_interval = Array(), account=0} = req.body;
        let allRanges = ranges.split("-")
        let rangesArray = allRanges.map(function(e:any) { 
            e = e.split('_'); 
            return e;
        });
        let requestSite = {}

        if(Array.isArray(site)){
            requestSite = {_id : { $in: site}}
        }
        
        let TypeAccount = AccountType.find({}).lean().exec();
        let Sites =  Site.find(requestSite).populate('Account').lean().exec();
        let LogTypesDown = LogType.find({}, '_id logTypeId').exec();

        let allSites = Array();        
        
        try {
            await Promise.all([Sites, TypeAccount, LogTypesDown]).then(async ([sites, typeaccount, logtypesdown])=>{
                let logTypesDown = Array();
                let allLogType = Array();
                let downPauseType = Array();
                logtypesdown.forEach(e => {
                    allLogType[e._id] = e.logTypeId
                    if(e.logTypeId == 1 || e.logTypeId === 99 ){
                        downPauseType.push(e._id.toString())
                        logTypesDown.push(e._id.toString())
                    }
                    if(e.logTypeId === 2 ){
                        logTypesDown.push(e._id.toString())
                    }
                })
                if(account != 0)
                    sites = sites.filter((e : any) => e.Account.Type == account)
                
                for(var i = 0; i < sites.length; i++){
                    let uptime : any = [];
                    let allLogs = Array()
                    if(typeof ranges === "string"){
                        for(var j = 0; j < rangesArray.length; j++){
                            let durationLog : any = 0; 
                            if(parseInt(rangesArray[j][0]) < sites[i].createDatetime){
                                rangesArray[j][0] = sites[i].createDatetime;
                            }
                            let logsSite : any = await this.getLogInIntervalle(sites[i]._id, parseInt(rangesArray[j][0]), parseInt(rangesArray[j][1]), logTypesDown, allLogType, downPauseType);
                            logsSite =  this.getLogsWithDayAndInterval(logsSite, custom_days_range, custom_interval, sites[i]._id)
                            logsSite.sort((a : any, b : any) => a.datetime - b.datetime);                        
                            let rangeDuration = this.getDuration(parseInt(rangesArray[j][0]), parseInt(rangesArray[j][1]), custom_days_range, custom_interval)
                            logsSite.forEach((el : any, idx : any, array : any) => {    
                                if(el === logsSite[logsSite.length-1]){
                                    el.duration = parseInt(moment().format("X")) - el.datetime
                                } else {
                                    el.duration = logsSite[idx + 1].datetime - el.datetime
                                }
                                if(el.datetime < parseInt(rangesArray[j][0]) && el.datetime + el.duration > parseInt(rangesArray[j][1]) && el.type === 1){
                                    durationLog = null
                                } else {
                                    // Si le dernier log est un log de pause 
                                    if(el.datetime <= parseInt(rangesArray[j][0]) && el.datetime + el.duration >= parseInt(rangesArray[j][0]) && (el.type === 99) && el == logsSite[logsSite.length-1]){
                                        durationLog = null;
                                    } else if(el.datetime < parseInt(rangesArray[j][0]) && el.datetime + el.duration > parseInt(rangesArray[j][0]) && el.type === 1){
                                        let duration = el.datetime + el.duration - parseInt(rangesArray[j][0]); 
                                        durationLog = durationLog + duration
                                    }else if(el.datetime >= parseInt(rangesArray[j][0]) && el.datetime <= parseInt(rangesArray[j][1]) && el.type === 1){
                                        if(el.takeIntoAccount){
                                            let duration = el.duration
                                            if(el.datetime + el.duration > parseInt(rangesArray[j][1]))
                                                duration = parseInt(rangesArray[j][1]) - el.datetime
                                            durationLog = durationLog + duration
                                        }
                                        allLogs.push(el)
                                    } 
                                }
                                
                            });
                            
                            if(parseInt(rangesArray[j][1]) < sites[i].createDatetime) {
                                durationLog = null
                            }
                            if(durationLog == null){
                                uptime.push("0.000")
                            } else if( durationLog === 0) {
                                uptime.push("100.000")
                            }else {
                                let tmpUptime = ((rangeDuration - durationLog)/rangeDuration)*100
                                uptime.push(tmpUptime.toFixed(3))
                            }
                        }
                    }

                    allLogs.sort((a, b) => b.datetime - a.datetime);
                    let accounttype = typeaccount.find((e : any) => e._id.toString() === sites[i].Account.Type)
                    let ssl = {
                        "ssl_monitored":sites[i].ssl_monitored,
                        "ssl_issuer":sites[i].ssl_issuer,
                        "ssl_subject":sites[i].ssl_subject,
                        "ssl_algo":sites[i].ssl_algo,
                        "ssl_expireDatetime":sites[i].ssl_expireDatetime,
                        "ssl_error":sites[i].ssl_error
                    };
                    let screenShot = {
                        "screenshot_url":sites[i].screenshot_url,
                        "screenshot_dateTime":sites[i].screenshot_dateTime,
                        "screenshot_error":sites[i].screenshot_error
                    };
                    let lighthouse = {
                        "lighthouse_url":sites[i].lighthouse_url,
                        "lighthouse_performance":sites[i].lighthouse_performance,
                        "lighthouse_accessibility":sites[i].lighthouse_accessibility,
                        "lighthouse_bestPractices":sites[i].lighthouse_bestPractices,
                        "lighthouse_seo":sites[i].lighthouse_seo,
                        "lighthouse_pwa":sites[i].lighthouse_pwa,
                        "lighthouse_dateTime":sites[i].lighthouse_dateTime
                    };
                    let siteArray = {
                        "id":sites[i]._id,
                        "moment": parseInt(moment().tz('Europe/Paris').format('X')),
                        "accounttype":accounttype,
                        "id_object":sites[i]._id,
                        "status": sites[i].status,
                        "account":sites[i].Account._id,
                        "accountname":sites[i].Account.email,
                        "custom_uptime_ranges":uptime.join("-"),
                        "custom_days_range": custom_days_range.join("-"),
                        "friendly_name":sites[i].name,
                        "creation_datetime":sites[i].createDatetime,
                        "url":sites[i].url,
                        "logs":allLogs,
                        "ssl":ssl,
                        "screenshot":screenShot,
                        "lighthouse":lighthouse
                    }

                    allSites.push(siteArray);
                }
                allSites.sort((a,b) => ((a.friendly_name).toUpperCase() > (b.friendly_name).toUpperCase()) ? 1 : (((b.friendly_name).toUpperCase() > (a.friendly_name).toUpperCase()) ? -1 : 0));
                res.json(allSites)
            },reason => {
                res.json(reason)
            });
        } catch(e){
            console.log(e)
        }
    }

    getLogsWithDayAndInterval(logs:Array<any>, forbidenDay: Array<string>, intervals: Array<string>, id:string){
        let allLogs = Array()
        let momentTime = parseInt(moment().tz('Europe/Paris').format('X'));
        if(intervals.length > 0 || forbidenDay.length) {
            logs.forEach(el => {
                if(el.type === 1) {
                    let startLog = el.datetime
                    let endLog = el.datetime + el.duration
                    while(endLog > startLog){
                        let duration:number
                        let startDay = parseInt(moment(endLog-1, 'X').tz('Europe/Paris').startOf("days").format('X'))
                        let startInterval = startDay
                        let endInterval = parseInt(moment(endLog-1, 'X').tz('Europe/Paris').endOf("days").format('X'))
                        if(intervals.length > 0){
                            startInterval = startDay + parseInt(intervals[0])

                            endInterval = startDay + parseInt(intervals[1])
                        }
                        if(endInterval > momentTime) {
                            endInterval = momentTime
                        }

                        if(startDay <= startLog)
                            startDay = startLog
                        let arrayInterval = Array(startInterval, endInterval, startDay, endLog)
                        if((startDay < startInterval && endLog < startInterval) ||  (startDay > endInterval && endLog > endInterval))
                            duration = 0
                        else
                            duration = (Math.max(...arrayInterval) - Math.min(...arrayInterval)) - (Math.max(startInterval, startDay) - Math.min(startInterval, startDay)) - (Math.max(endInterval, endLog) - Math.min(endInterval, endLog))
                        
                        if(forbidenDay.length > 0 && forbidenDay.indexOf(moment(startInterval, 'X').tz('Europe/Paris').endOf('day').locale('en').format('dddd').toLowerCase()) > -1){
                            duration = 0
                        }

                        if(duration != 0){
                            if(startDay <= startInterval)
                                startDay = startInterval
                            let log = {
                                "site":el.site,
                                "startInterval":startInterval,
                                "datetime":startDay,
                                "duration":duration,
                                "reason":el.reason,
                                "type":el.type,
                                "comment":el.comment,
                                "takeIntoAccount":el.takeIntoAccount
                            }
                            allLogs.push(log)
                        }
                        endLog = startDay - 1
                    }
                } else {
                    allLogs.push(el)
                }
            });
        } else {
            allLogs = logs
        }
        return allLogs;
    }

    getDuration(start:number, end: number, forbidenDay: Array<string>, intervals: Array<string>){
        let total = 0
        while(end > start){
            let startElement = parseInt(moment(end-1, 'X').tz('Europe/Paris').startOf("days").format('X'))
            let startInterval:number
            let endInterval:number
            if(intervals.length > 0){
                startInterval = parseInt(moment(startElement, 'X').tz('Europe/Paris').add(parseInt(intervals[0]), 'seconds').format('X'))
                endInterval = parseInt(moment(startElement, 'X').tz('Europe/Paris').add(parseInt(intervals[1]), 'seconds').format('X'))
                if(endInterval > end)
                    endInterval = end
            } else {
                startInterval = parseInt(moment(end-1, 'X').tz('Europe/Paris').startOf("days").format('X'))
                endInterval = end
            }
            let duration:number
            if(startInterval < start)
                startInterval  = start
            duration = endInterval - startInterval
            
            total = total + duration
            if(forbidenDay.length > 0 && forbidenDay.indexOf(moment(startElement, 'X').tz('Europe/Paris').endOf('day').locale('en').format('dddd').toLowerCase()) > -1){
                total = total - duration
            }
            end = parseInt(moment(end-1, 'X').tz('Europe/Paris').startOf("days").format('X'))
        }
        return total
    }
}