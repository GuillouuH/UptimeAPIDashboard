
import * as mongoose from 'mongoose';
import { UserSchema, IUser } from '../models/UserModel';
import { Request, Response } from 'express';
import  * as bcrypt from 'bcryptjs';
import  * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const User = mongoose.model<IUser>('Users', UserSchema);

export class UserController{
    public async addUSer (req: Request, res: Response) {     
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let salt = await bcrypt.genSalt(10);
        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(200).json({
                    success:0,
                    msg: "User already exist"
                });
            }
            user = new User({
                username,
                email,
                password
            });
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {user: {
                    id: user.id,
                    mail: email,
                    username:username
                }
            };
            jwt.sign(
                payload,
                JWT_SECRET_KEY!, {
                    expiresIn: 86400
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        success:1,
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err)
            res.status(500).send("Error");
        }
    }

    public async editUser(req: Request, res: Response){
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.newPassword;
        let salt = await bcrypt.genSalt(10);
        try {
            let newUser : any = {username: username, email:email}
            
            if(password !== '' ){
                newUser.password = await bcrypt.hash(password, salt);
            }

            let userModify : any = await User.findOneAndUpdate({_id:req.body.id}, newUser).exec();
            const payload = {userModify: {
                    id: userModify._id,
                    mail: email,
                    username:username
                }
            };
            jwt.sign(
                payload,
                JWT_SECRET_KEY!, {
                    expiresIn: 86400
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        success:true,
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err)
            res.status(500).send("Error");
        }
    }

    public async userLogin (req: Request, res: Response) {          
        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(200).json({
                    success:0,
                    message: "User not exists"
            });
            let match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(200).json({
                    success:0,
                    message: "Password incorect"
                });
            
            let payload = { user: {
                    id: user.id,
                    mail: user.email,
                    username:user.username
                }
            };
            jwt.sign(
                payload,
                JWT_SECRET_KEY!,
                {
                    expiresIn: 604800
                },
                (err, token) => {
                    if (err) throw err;
                        res.status(200).json({
                            success:1,
                            token
                        });
                }
            );
        } catch (e) {
            res.status(500).json({
                message: "Server Error"
            });
        }
    }

    public async getUserCredentials(req: any, res: any){
        try {
            let userMap = await User.findById(req.user.id);
            res.json(userMap);
        } catch (err) {
            res.send({ message: "Error" });
        }
    }

    public getUsers (req: Request, res: Response) {           
        User.find({}, (err, user) => {
            if(err){
                res.send(err);
            }
            res.json(user);
        }).populate('Type');
    }

    public async deleteUer (req: Request, res: Response) {           
        try {
            await User.deleteOne({_id:req.query.id}).exec();
            res.json({success:true, message : "Remove"});
        } catch(e){
            res.send({success:false,message: "Error" });
        }
    }
}