import * as mongoose from 'mongoose';
import { FavoriteSchema } from '../models/FavoritesModel';
import { Request, Response } from 'express';

const Favorite = mongoose.model('Favorites', FavoriteSchema);

export class FavoriteController{
    public addFavorite (req: Request, res: Response) {                
        let newFavorite = new Favorite(req.body);
        
        newFavorite.save((err, favorite) => {
            if(err){
                res.send(err);
            }    
            res.json(favorite);
        });
    }

    public listFavorite(req: Request, res: Response){
        Favorite.find({}, (err, favorites) => {
            if(err){
                res.send(err);
            }
            res.json(favorites);
        }).lean();
    }

    public deleteFavorite(req: Request, res: Response) {
        let id = req.body.id;
        let DeleteFavorite = Favorite.deleteOne({_id:id}).exec();
        Promise.all([DeleteFavorite]).then(favorite =>{
            let data = {'State':'success', 'Message':'Favorite deleted successfully'}
            res.json(data)
        });
    }
}
