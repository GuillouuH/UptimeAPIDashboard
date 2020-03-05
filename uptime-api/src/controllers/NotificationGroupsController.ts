
import * as mongoose from 'mongoose';
import { NotificationGroupSchema, INotificationGroup } from '../models/NotificationGroupsModel';
import { Request, Response } from 'express';


const NotificationGroups = mongoose.model<INotificationGroup>('NotificationGroups', NotificationGroupSchema);

export class NotificationGroupController{
    public getNotificationGroup (req: Request, res: Response) {           
        NotificationGroups.find({}, (err, notificationgroups) => {
            if(err){
                res.send(err);
            }
            res.json(notificationgroups);
        });
    }
}