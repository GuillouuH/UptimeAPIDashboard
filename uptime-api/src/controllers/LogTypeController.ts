import * as mongoose from 'mongoose';
import { LogTypeSchema } from '../models/LogTypeModel';
import { Request, Response } from 'express';

const LogType = mongoose.model('LogTypes', LogTypeSchema);

export class LogTypeController{
    public addLogType (req: Request, res: Response) {                
        let newLogType = new LogType(req.body);
        
        newLogType.save((err, logType) => {
            if(err){
                res.send(err);
            }    
            res.json(logType);
        });
    }

}
