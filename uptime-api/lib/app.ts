import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as cron from "node-cron";
import { Routes } from "./routes/UptimeRoutes";
import { UpdateDataController } from "./controllers/UpdateDataController";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PWD = process.env.MONGODB_PWD;
const MONGODB_SERVER = process.env.MONGODB_SERVER || "127.0.0.1";
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const EXECUTE_CRON = process.env.EXECUTE_CRON || 0;

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = `mongodb://${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_SERVER}:${MONGODB_PORT}/${MONGODB_DB}`;
    public updateDataController = new UpdateDataController()
    constructor() {
        this.app = express();
        this.app.use(cors())
        this.config();
        this.routePrv.routes(this.app);     
        this.mongoSetup();
        if(EXECUTE_CRON == "1"){
            this.executeCron();
        }
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useFindAndModify: false});    
    }

    private executeCron = async () => {
        await cron.schedule('* * * * *', async () => {
            let dataToStore = await this.updateDataController.saveAllSites();
            console.log(dataToStore);
        });
    }    
}

export default new App().app;