import {Request, Response} from "express";
import { AccountTypeController } from "../controllers/AccountTypeController";
import { AccountController } from "../controllers/AccountController";
import { SiteController } from "../controllers/SiteController";
import { UpdateDataController } from "../controllers/UpdateDataController";
import { LogTypeController } from "../controllers/LogTypeController";
import { LogController } from "../controllers/LogController";
import { UserController } from "../controllers/UserController";
import { FavoriteController } from "../controllers/FavoriteController"
import { NotificationGroupController } from "../controllers/NotificationGroupsController"

import { AuthenticateUser } from "../middlewares/authentication"

export class Routes {       
    public accountTypeController: AccountTypeController = new AccountTypeController()
    public accountController: AccountController = new AccountController() 
    public siteController: SiteController = new SiteController() 
    public updateDataController: UpdateDataController = new UpdateDataController() 
    public logTypeController: LogTypeController = new LogTypeController()
    public logController: LogController = new LogController()
    public userController: UserController = new UserController()
    public favoriteController: FavoriteController = new FavoriteController()
    public notificationGroupController: NotificationGroupController = new NotificationGroupController()

    public routes(app: any): void {          
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })
        
        app.route('/updateData')
        .post(AuthenticateUser, this.updateDataController.saveAllSites);
        
        app.route('/account')
        .get(AuthenticateUser, this.accountController.getAccounts)
        .post(AuthenticateUser, this.accountController.addAccount);
        
        app.route('/accountype')
        .get(AuthenticateUser, this.accountTypeController.getAccountType)
        .post(AuthenticateUser, this.accountTypeController.addAccountType);

        app.route('/sites')
        .get(AuthenticateUser, this.siteController.getSite)
        .post(AuthenticateUser, this.siteController.addSiteWithLog)
        .delete(AuthenticateUser, this.siteController.deleteSites)

        app.route('/pauseSite')
        .post(AuthenticateUser, this.siteController.pauseMonitorSite)

        app.route('/continueSite')
        .post(AuthenticateUser, this.siteController.continueMonitorSite)

        app.route('/logs')
        .post(AuthenticateUser, this.logController.getLogs)
        .delete(AuthenticateUser, this.logController.deleteLogs)

        app.route('/logtakeintoaccount')
        .post(AuthenticateUser, this.logController.takeIntoAccountLog)

        app.route('/siteslogs')
        .post(AuthenticateUser, this.logController.getLogsBySites)

        app.route('/saveLogType')
        .post(AuthenticateUser, this.logTypeController.addLogType);

        app.route('/addUser')
        .post(AuthenticateUser, this.userController.addUSer);
        
        app.route('/userLogin')    
        .post(this.userController.userLogin)

        app.route('/favorites')
        .get(AuthenticateUser, this.favoriteController.listFavorite)
        .post(AuthenticateUser, this.favoriteController.addFavorite)
        .delete(AuthenticateUser, this.favoriteController.deleteFavorite);
        
        app.route('/notificationgroups')
        .get(AuthenticateUser, this.notificationGroupController.getNotificationGroup)
        
        app.route('/notificationgroupssite')
        .get(AuthenticateUser, this.notificationGroupController.getSiteNotificationGroup)
    
        app.use(AuthenticateUser).route('/getmycredentials')  
        .get(AuthenticateUser, this.userController.getUserCredentials)
    
    }
}