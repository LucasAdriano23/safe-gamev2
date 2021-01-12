import db from "./../models/Connection";
import { UsuarioInstance } from './../models/UsuarioModel';
import { JWT_SECRET } from './../utils/utils';
import { RequestHandler, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const extractJwtMiddleware = (): RequestHandler => {

    return (req:Request,res:Response,next:NextFunction): void => {
         let authorization:string = req.get('authorization');
         let token:string = authorization ? authorization.split(' ')[1] : undefined;

         req['context'] = {};
         req['context']['authorization'] = authorization;

         if(!token){ return next(); }
         
         jwt.verify(token, JWT_SECRET, (err,decoded:any) =>{
             if(err) { return next(); }

            db.Usuario.findById(decoded.sub,{
                attributes:['id','email']
            }).then((usuario:UsuarioInstance) => {
            
                if(usuario){ 
                    req['context']['authUser'] = {
                        id:usuario.get('id'),
                        email:usuario.get('email')
                    };
                }
                
                return next();
            });

            
         });

    }
};