import  * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import * as mongoose from 'mongoose';
import { UserSchema, IUser } from '../models/UserModel';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = mongoose.model<IUser>('Users', UserSchema);

export async function AuthenticateUser(req:any, res:any, next:any) { 
    let token = req.header("user_token");


    if (!token) return res.status(401).json({ message: "Authentification impossible" });

    try {
        let decoded:any = jwt.verify(token, JWT_SECRET_KEY!);
        let userMap = await User.findById(decoded.user.id);
        req.user = userMap;
        if(userMap === null)
            res.status(401).json({ message: "Authentification impossible" });
        else
            next();
    } catch (e) {
        let userMap = await User.findOne({"apiToken":token});
        if(userMap === null)
            res.status(401).json({ message: "Authentification impossible" });
        else {
            req.user = userMap;
            next();
        }
    }
}