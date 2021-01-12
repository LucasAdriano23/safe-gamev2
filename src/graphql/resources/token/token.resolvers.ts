import { JWT_SECRET } from './../../../utils/utils';
import { UsuarioInstance } from './../../../models/UsuarioModel';
import { DbConnection } from './../../../interfaces/DbConnectionInterface';

import * as jwt from "jsonwebtoken";

export const tokenResolvers = {
    Mutation:{
        createToken: (parent,{ cpf, senha },{db}:{db:DbConnection}) => {
            return db.Usuario.findOne({
                where:{cpf:cpf},
                attributes:['id','senha']
            }).then((usuario:UsuarioInstance) => {

                let errorMessage:string = 'Cpf ou senha incorretos!';
                if(!usuario || !usuario.isPassword(usuario.get('senha'), senha)) { throw new Error(errorMessage); }

                const payLoad = {sub:usuario.get('id')};
                
                return {
                    token: jwt.sign(payLoad, JWT_SECRET)
                }
            });
        }
    }
};