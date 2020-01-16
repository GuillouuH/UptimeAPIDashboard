import  * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export function AuthenticateUser(req:any, res:any, next:any) { 
    let token = req.header("user_token");

    if (!token) return res.status(401).json({ message: "Authentification impossible" });
    try {
        let decoded:any = jwt.verify(token, JWT_SECRET_KEY!);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(500).send({ message: "Invalid Token" });
    }
}

