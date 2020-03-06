
import * as mongoose from 'mongoose';
import { AccountSchema } from '../models/AccountModel';
import { Request, Response } from 'express';
import { SiteSchema, ISite } from '../models/SiteModel';

const Account = mongoose.model('Accounts', AccountSchema);
const Site = mongoose.model<ISite>('Site', SiteSchema);

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

    public async getSitesByAccount(req: Request, res: Response) {    
        try {
            let siteMap = await Site.find({Account:req.query.id});
            res.json(siteMap);
        } catch (err) {
            res.send({ message: "Error" });
        }
    }
}