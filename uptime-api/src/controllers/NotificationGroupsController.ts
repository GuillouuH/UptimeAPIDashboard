
import * as mongoose from 'mongoose';
import { NotificationGroupSchema, INotificationGroup } from '../models/NotificationGroupsModel';
import { SiteSchema, ISite } from '../models/SiteModel';

import { Request, Response } from 'express';

const NotificationGroups = mongoose.model<INotificationGroup>('NotificationGroups', NotificationGroupSchema);
const Site = mongoose.model<ISite>('Site', SiteSchema);

export class NotificationGroupController{
    public getNotificationGroup (req: Request, res: Response) {           
        NotificationGroups.find({}, (err, notificationgroups) => {
            if(err){
                res.send(err);
            }
            res.json(notificationgroups);
        });
    }

    public async editNotificationGroup(req: any, res: any){
        try {
            let request:any = {cibles:req.body.cibles};
            await NotificationGroups.findOneAndUpdate({_id:req.body.group_id}, request).exec();
            res.json({success:true, message : "Update"});
        } catch(err){
            res.send({success:false,message: "Error" });
        }
    }

    public async getSiteNotificationGroup(req: any, res: any){
        try {
            let siteMap = await Site.findById(req.query.id);
            let notificationGroup = siteMap!.NotificationGroup;
            let notificationGroupMap = await NotificationGroups.findById(notificationGroup);
            res.json(notificationGroupMap);
        } catch (err) {
            res.send({ message: "Error" });
        }
    }

    public async setSiteNotificationGroup(req: any, res: any){
        try {
            let newNotificationGroup = req.body.group
            let siteUpdate = await Site.findById(req.body.site);
            let request:any = {NotificationGroup:newNotificationGroup};
            if(newNotificationGroup == "")
                request = {$unset: {NotificationGroup:1}}

            await Site.findOneAndUpdate({_id:req.body.site}, request).exec();
            res.json({success:true, message : "Update"});
        } catch (err) {
            res.send({success:false,message: "Error" });
        }
    }
}