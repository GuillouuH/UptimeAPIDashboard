import * as mongoose from 'mongoose';
import { SiteSchema } from '../models/SiteModel';
import { LogSchema } from '../models/LogModel';
import { LogTypeSchema } from '../models/LogTypeModel';
import { Request, Response } from 'express';
import moment from "moment"
import { AccountSchema } from '../models/AccountModel';

const Site = mongoose.model('Sites', SiteSchema);
const Log = mongoose.model('Log', LogSchema);
const LogType = mongoose.model('LogTypes', LogTypeSchema);
const Account = mongoose.model('Accounts', AccountSchema);

export class SiteController{
    public addSite (req: Request, res: Response) {                
        let newSite = new Site(req.body);
        newSite.save((err, site) => {
            if(err){
                res.send(err);
            }    
            res.json(site);
        });
    }

    public async editSite (req: Request, res: Response) {        
        try {
            let request:any = {name:req.body.name, url:req.body.url, Account:req.body.account, NotificationGroup: req.body.notificationgroup};
            if(req.body.notificationgroup == "0")
                request = {name:req.body.name, url:req.body.url, Account:req.body.account,$unset: {NotificationGroup:1}};
            await Site.findOneAndUpdate({_id:req.body.id}, request).exec();
            res.json({success:true, message : "Update"});
        } catch (err) {
            res.send({success:false,message: "Error" });
        }
    }

    public async addSiteWithLog (req: Request, res: Response) {
        try {
            let account = await Account.findOne({_id:req.body.account});
            let siteToAdd:any = {name : req.body.name, url : req.body.url, createDatetime : moment().format("X"), Account : account!._id, status:1, NotificationGroup: req.body.notificationgroup}
            if(req.body.notificationgroup === "0")
                siteToAdd = {name : req.body.name, url : req.body.url, createDatetime : moment().format("X"), Account : account!._id, status:1}

            let logtype = await LogType.findOne({logTypeId:98});
            let newSite = new Site(siteToAdd);
            newSite.save(async (err, site) => {
                if(err){
                    res.send(err);
                } else {
                    try {
                        let logToAdd = {datetime:moment().format('X'), Site:site._id, Type: logtype!._id, duration:0, code:98, detail:"Monitor started", comment:"", takeIntoAccount:true}
                        let log =  new Log(logToAdd);
                        await log.save();
                        res.json({"success":1, "site":site});
                    } catch(err){
                        res.send({ "success":0, "message": err });
                    }   
                }
            }); 
        } catch (err) {
            res.send({ "success":0, "message": err });
        }
    }

    public getSite (req: Request, res: Response) {           
        Site.find({}, (err, site) => {
            if(err){
                res.send(err);
            }
            res.json(site);
        }).populate('Account');
    }

    public async deleteSite(req: Request, res: Response) {
        try {
            await Site.deleteOne({_id:req.query.id}).exec();
            await Log.deleteMany({Site:req.query.id}).exec();
            
            res.json({success:true, message : "Remove"});
        } catch (err) {
            res.send({success:false,message: "Error" });
        }
    }

    public async pauseMonitorSite(req: Request, res: Response) {
        try {
            let logtype = await LogType.findOne({logTypeId:99});
            let logToAdd = {datetime:moment().format('X'), Site:req.body.id, Type: logtype!._id, duration:0, code:99, detail:"Monitor Paused"}
            await Site.findOneAndUpdate({_id:req.body.id}, { "status": 0}).exec();
            let log = new Log(logToAdd);
            log.save();   
            res.json({success:1});
        } catch (err) {
            res.send({ success:0, message: "Error" });
        }
    }

    public async continueMonitorSite(req: Request, res: Response) {
        try {
            let logtype = await LogType.findOne({logTypeId:98});
            let logToAdd = {datetime:moment().format('X'), Site:req.body.id, Type: logtype!._id, duration:0, code:98, detail:"Monitor Started"}
            await Site.findOneAndUpdate({_id:req.body.id}, { "status": 2}).exec();   
            let log = new Log(logToAdd);
            log.save();       
            res.json({success:1});
        } catch (err) {
            res.send({ success:0, message: "Error" });
        }
    }
}