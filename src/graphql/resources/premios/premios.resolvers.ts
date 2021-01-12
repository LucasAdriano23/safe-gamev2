import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { authResolvers } from './../../composable/auth.resolver';
import { PremiosInstance } from './../../../models/PremiosModel';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";

import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';

export const premiosResolvers = {

    Premios:{
        idEmpresa:(empresa,args,{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Empresa.findById(empresa.get('idEmpresa'));
        },
    },

    Query:{
        listarPremios:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Premios.findAll({
                limit:first,
                offset:offset
            }).catch(handleError);
        },
    },

    Mutation:{
        adicionarPremio:compose(...authResolvers)((parent,{ input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{ 
                return db.Premios.create(input, {transaction:t}); 
            }).catch(handleError);
        }),

        editarPremio:compose(...authResolvers)((parent,{ id,input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Premios.findById(id).then((premios:PremiosInstance) => {
                    throwError(!premios,`Premio com o id ${id} não foi encontrado!`);
                    return premios.update(input,{transaction:t});
                });
            }).catch(handleError);
        }),

        excluirPremio:compose(...authResolvers)((parent,{id},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Premios.findById(id).then((premios:PremiosInstance) => {
                    throwError(!premios,`Premio com o id ${id} não foi encontrado!`);
                    return premios.destroy({transaction:t})
                        .then(premios => !!premios);
                });
            }).catch(handleError);
        }),
    }
};