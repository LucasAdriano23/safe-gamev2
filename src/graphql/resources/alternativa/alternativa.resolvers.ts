import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { authResolvers } from './../../composable/auth.resolver';
import { AlternativaInstance } from './../../../models/AlternativaModel';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";

import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';

export const alternativaResolvers = {

    Alternativa:{
        idCarta:(carta,args,{db}:{ db:DbConnection },info:GraphQLResolveInfo) =>{
            return db.Carta
                .findById(carta.get('idCarta'));
        },
    },

    Query: {
        listarAlternativas:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Alternativa.findAll({
                limit:first,
                offset:offset
            }).catch(handleError);
        },

        listarAlternativa:(parent,{ id },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.Alternativa.findById(id).
            then((alternativa:AlternativaInstance) =>{
                if(!alternativa) throw new Error(`Alternativa com o id ${id} não foi encontrado!`);
                return alternativa;
            }).catch(handleError);
        },
    },

    Mutation:{
        adicionarAlternativa:compose(...authResolvers)((parent,{ input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{ 
                return db.Alternativa.create(input, {transaction:t}); 
            }).catch(handleError);
        }),

        editarAlternativa:compose(...authResolvers)((parent,{ id,input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Alternativa.findById(id).then((alternativa:AlternativaInstance) => {
                    throwError(!alternativa,`Alternativa com o id ${id} não foi encontrado!`);
                    return alternativa.update(input,{transaction:t});
                });
            }).catch(handleError);
        }),

        excluirAlternativa:compose(...authResolvers)((parent,{id},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Alternativa.findById(id).then((alternativa:AlternativaInstance) => {
                    throwError(!alternativa,`Alternativa com o id ${id} não foi encontrado!`);
                    return alternativa.destroy({transaction:t})
                        .then(alternativa => !!alternativa);
                });
            }).catch(handleError);
        }),
    }

};