import * as mongoose from 'mongoose';
import { AccountTypeSchema } from '../models/AccountTypeModel';
import { Request, Response } from 'express';

const AccountType = mongoose.model('typeaccount', AccountTypeSchema);

export class AccountTypeController{
    public addAccountType (req: Request, res: Response) {                
        let newAccountType = new AccountType(req.body);
        
        newAccountType.save((err, accountType) => {
            if(err){
                res.send(err);
            }    
            res.json(accountType);
        });
    }

    public getAccountType (req: Request, res: Response) {           
        AccountType.find({}, (err, accountType) => {
            if(err){
                res.send(err);
            }
            res.json(accountType);
        });
    }
}
