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
        req.user = decoded.user;
        let userMap = await User.findById(req.user.id);
        if(userMap === null)
            res.status(401).json({ message: "Authentification impossible" });
        else
            next();
    } catch (e) {
        console.log(e)
        res.status(401).json({ message: "Authentification impossible" });
    }
}

