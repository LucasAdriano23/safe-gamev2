import { throwError } from './../../../utils/utils';
import { AuthUser } from './../../../interfaces/AuthUserInterface';
import { UsuarioInstance } from './../../../models/UsuarioModel';
import { DbConnection } from './../../../interfaces/DbConnectionInterface';

import { authResolver, authResolvers } from './../../composable/auth.resolver';
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from 'sequelize';
import { handleError } from '../../../utils/utils';
import { compose } from '../../composable/composable.resolver';
import { verifyTokenResolver } from '../../composable/verify-token.resolver';

export const usuarioResolvers = {

    Usuario:{
        idEmpresa:(empresa,args,{db}:{ db:DbConnection },info:GraphQLResolveInfo) =>{
            return db.Empresa
                .findById(empresa.get('idEmpresa'));
        }
    },
    Query:{
        listarUsuarios:(parent,{ first=10, offset= 0 },{db}:{db:DbConnection},info:GraphQLResolveInfo) => {
            console.log('Parametros recebidos',parent);
            return db.Usuario.findAll({
                limit:first,
                offset:offset,
                order:[['nomeUsuario','ASC']]
            }).catch(handleError);
        },
        listarUsuario:(parent,{id},{db}:{db:DbConnection},info:GraphQLResolveInfo) =>{
            id = parseInt(id);
            return db.Usuario.findById(id).then((usuario:UsuarioInstance) => {
                throwError(!usuario,`Usuário com o id ${id} não foi encontrado!`);
                
                return usuario;
            }).catch(handleError);
        },
        currentUser:compose(...authResolvers)((parent,args,{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) =>{
            return db.Usuario
            .findById(authUser.id)
            .then((usuario:UsuarioInstance) =>{
                throwError(!usuario,`Usuário com o id ${authUser.id} não foi encontrado!`);

                return usuario;
                }).catch(handleError);
        }),
    },
    Mutation:{
        adicionarUsuario:(parent,params,{db}:{db:DbConnection},info:GraphQLResolveInfo) =>{
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Usuario.create(params.input,{transaction:t});
            }).catch(handleError);
        },

        editarUsuario:compose(...authResolvers)((parent,{id,input},{db, authUser}:{db:DbConnection, authUser:AuthUser},info:GraphQLResolveInfo) =>{
            id = parseInt(id);

            console.log("Parâmetros recebidos: ",{input});

            return db.sequelize.transaction((t:Transaction) => {
                return db.Usuario.findById(id)
                .then((usuario:UsuarioInstance) =>{
                    throwError(!usuario,`Usuário com o id ${id} não foi encontrado!`);

                    return usuario.update(input,{transaction:t}); 
                });
            }).catch(handleError);
        }),

        editarSenhaUsuario:compose(...authResolvers)((parent,{input},{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) =>{
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Usuario.findById(authUser.id)
                .then((usuario:UsuarioInstance) =>{
                    throwError(!usuario,`Usuário com o id ${authUser.id} não foi encontrado!`);

                    return usuario.update(input,{transaction:t})
                        .then((usuario:UsuarioInstance) => !!usuario); 
                });
            }).catch(handleError);
        }),

        excluirUsuario:(parent,{ id },{db,authUser}:{db:DbConnection,authUser:AuthUser},info:GraphQLResolveInfo) =>{
            id = parseInt(id);
            return db.sequelize.transaction((t:Transaction) =>{
                return db.Usuario.findById(id).then((usuario:UsuarioInstance) =>{
                    throwError(!usuario,`Usuário com o id ${id} não foi encontrado!`);

                        return usuario.destroy({transaction:t})
                            .then(usuario => !!usuario);
                });
            }).catch(handleError);
        },
    }
};