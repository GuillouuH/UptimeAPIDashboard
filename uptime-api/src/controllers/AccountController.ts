
import * as mongoose from 'mongoose';
import { AccountSchema } from '../models/AccountModel';
import { Request, Response } from 'express';

const Account = mongoose.model('Accounts', AccountSchema);

export class AccountController{
    public addAccount (req: Request, res: Response) {                
        let newAccount = new Account(req.body);
        newAccount.save((err, account) => {
            if(err){
                res.send(err);
            }
            let data = {'State':'success', 'Message':'Account add successfully', 'Account': account}
            res.json(data)    
        });
    }

    public getAccounts (req: Request, res: Response) {           
        Account.find({}, (err, account) => {
            if(err){
                res.send(err);
            }
            res.json(account);
        }).populate('Type');
    }
}