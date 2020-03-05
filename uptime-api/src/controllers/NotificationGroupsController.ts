
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
}