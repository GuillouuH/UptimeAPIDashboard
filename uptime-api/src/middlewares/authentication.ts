import  * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import * as mongoose from 'mongoose';
import { UserSchema, IUser } from '../models/UserModel';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = mongoose.model<IUser>('Users', UserSchema);

export async function AuthenticateUser(req:any, res:any, next:any) { 
    let token = req.header("user_token");
    let apitoken = req.header("api_token")
    if (!token && !apitoken) return res.status(401).json({ message: "Authentification impossible" });
    
    if(token) {
        try {
            let decoded:any = jwt.verify(token, JWT_SECRET_KEY!);
            let userMap = await User.findById(decoded.user.id);
            if(userMap === null)
                res.status(401).json({ message: "Authentification impossible" });
            else {
                req.user = userMap;
                next();
            }
        } catch (e) {
            res.status(401).json({ message: "Authentification impossible" });
        }
    }

    if(apitoken){
        try {
            let userMapApiToken = await User.findOne({"apiToken":apitoken});
            if(userMapApiToken === null)
                res.status(401).json({ message: "Authentification impossible" });
            else {
                req.user = userMapApiToken;
                next();
            }
        } catch (e) {
            res.status(401).json({ message: "Authentification impossible" });

        }
    }
}