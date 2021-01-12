import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { authResolvers } from './../../composable/auth.resolver';
import { CartaInstance } from './../../../models/CartaModel';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";

import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';

export const cartaResolvers = {

    Carta:{
        idsAlternativas:(alternativa,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Alternativa
            .findAll({
                where:{idCarta:alternativa.get('id')},
                limit:first,
                offset:offset
            });
        },
    },

    Query: {
        listarCartas:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Carta.findAll({
                limit:first,
                offset:offset
            }).catch(handleError);
        },

        listarCarta:(parent,{ id },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.Carta.findById(id).
            then((carta:CartaInstance) =>{
                if(!carta) throw new Error(`Carta com o id ${id} não foi encontrado!`);
                return carta;
            }).catch(handleError);
        },
    },

    Mutation:{
        adicionarCarta:compose(...authResolvers)((parent,{ input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{ 
                return db.Carta.create(input, {transaction:t}); 
            }).catch(handleError);
        }),

        editarCarta:compose(...authResolvers)((parent,{ id,input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Carta.findById(id).then((carta:CartaInstance) => {
                    throwError(!carta,`Carta com o id ${id} não foi encontrado!`);
                    return carta.update(input,{transaction:t});
                });
            }).catch(handleError);
        }),

        excluirCarta:compose(...authResolvers)((parent,{id},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Carta.findById(id).then((carta:CartaInstance) => {
                    throwError(!carta,`Carta com o id ${id} não foi encontrado!`);
                    return carta.destroy({transaction:t})
                        .then(carta => !!carta);
                });
            }).catch(handleError);
        }),
    }

};