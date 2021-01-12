import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { authResolvers } from './../../composable/auth.resolver';
import { EmpresaInstance } from './../../../models/EmpresaModel';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";

import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError, throwError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';

export const empresaResolvers = {

    Empresa:{
            usuarios:(usuario,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
                return db.Usuario
                .findAll({
                    where:{idEmpresa:usuario.get('id')},
                    limit:first,
                    offset:offset,
                    order:[['nome','ASC'],['sobrenome','ASC'],['pontuacao','DESC']]

                });
            },

            premios:(premio,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
                return db.Premios
                .findAll({
                    where:{idEmpresa:premio.get('id')},
                    limit:first,
                    offset:offset
                });
            },

            usuariosByRank:(usuario,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
                return db.Usuario
                .findAll({
                    where:{idEmpresa:usuario.get('id')},
                    limit:first,
                    offset:offset,
                    order:[['pontuacao','DESC'],['nomeUsuario','ASC']]

                });
            }
    },

    Query: {
        listarEmpresas:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            return db.Empresa.findAll({
                limit:first,
                offset:offset
            }).catch(handleError);
        },

        listarEmpresa:(parent,{ id },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.Empresa.findById(id).
            then((empresa:EmpresaInstance) =>{
                if(!empresa) throw new Error(`Empresa com o id ${id} não foi encontrado!`);
                return empresa;
            }).catch(handleError);
        },
    },

    Mutation:{
        adicionarEmpresa:compose(...authResolvers)((parent,{ input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            console.log("Parâmetros recebidos: ", input);
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{ 
                return db.Empresa.create(input, {transaction:t}); 
            }).catch(handleError);
        }),

        editarEmpresa:compose(...authResolvers)((parent,{ id,input },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            console.log("Parâmetros recebidos: ", input);
            input.usuario = authUser.id;
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Empresa.findById(id).then((empresa:EmpresaInstance) => {
                    throwError(!empresa,`Empresa com o id ${id} não foi encontrado!`);
                    return empresa.update(input,{transaction:t});
                });
            }).catch(handleError);
        }),

        excluirEmpresa:compose(...authResolvers)((parent,{id},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Empresa.findById(id).then((empresa:EmpresaInstance) => {
                    throwError(!empresa,`Empresa com o id ${id} não foi encontrado!`);
                    return empresa.destroy({transaction:t})
                        .then(empresa => !!empresa);
                });
            }).catch(handleError);
        }),
    }

};