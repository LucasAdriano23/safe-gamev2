import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { authResolvers } from './../../composable/auth.resolver';
import { RespostaUsuarioInstance } from './../../../models/RespostaUsuarioModel';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";

import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';

export const respostaUsuarioResolvers = {

    Query:{
        listarRespostasUsuarios:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.RespostaUsuario.findAll({
                limit:first,
                offset:offset
            }).catch(handleError);
        },
        listarRespostaUsuario:(parent,{ id },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.RespostaUsuario.findById(id).
            then((respostaUsuario:RespostaUsuarioInstance) =>{
                if(!respostaUsuario) throw new Error(`Resposta do usuário com o id ${id} não foi encontrado!`);
                return respostaUsuario;
            }).catch(handleError);
        },

    },

    Mutation:{
        adicionarRespostaUsuario:compose(...authResolvers)((parent,{ input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{ 
                return db.RespostaUsuario.create(input, {transaction:t}); 
            }).catch(handleError);
        }),

        editarRespostaUsuario:compose(...authResolvers)((parent,{ id,input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{
                return db.RespostaUsuario.findById(id).then((respostaUsuario:RespostaUsuarioInstance) => {
                    throwError(!respostaUsuario,`Resposta do usuário com o id ${id} não foi encontrado!`);
                    return respostaUsuario.update(input,{transaction:t});
                });
            }).catch(handleError);
        }),

        excluirRespostaUsuario:compose(...authResolvers)((parent,{id},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.RespostaUsuario.findById(id).then((respostaUsuario:RespostaUsuarioInstance) => {
                    throwError(!respostaUsuario,`Resposta do usuário com o id ${id} não foi encontrado!`);
                    return respostaUsuario.destroy({transaction:t})
                        .then(respostaUsuario => !!respostaUsuario);
                });
            }).catch(handleError);
        }),
    }
};