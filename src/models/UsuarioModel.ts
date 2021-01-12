import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface UsuarioAttributes {

    id?:number;
    nomeUsuario?:string;
    nome?:string
    sobrenome?:string
    email?:string;
    senha?:string;
    sexo?:string;
    pontuacao?:number;
    cpf?:string;
    fotoUsuario?:string;
    tipoLogin?:number;
    idEmpresa?:number;
    cargo?:number;
}

export interface UsuarioInstance extends Sequelize.Instance<UsuarioAttributes>,UsuarioAttributes{
    isPassword(encodedPassword: string, password:string):boolean;
}

export interface UsuarioModel extends BaseModelInterface, Sequelize.Model<UsuarioInstance,UsuarioAttributes>{}

export default (sequelize:Sequelize.Sequelize,DataTypes:Sequelize.DataTypes): UsuarioModel =>{
    const Usuario: UsuarioModel = 
        sequelize.define('Usuario',{
            id:{
                type:DataTypes.INTEGER,
                allowNull:false,
                primaryKey:true,
                autoIncrement:true
            },
            nomeUsuario:{
                type: DataTypes.STRING(128),
                allowNull:false
            },
            nome:{
                type: DataTypes.STRING(128),
                allowNull:false,
                defaultValue:''
            },
            sobrenome:{
                type: DataTypes.STRING(128),
                allowNull:false,
                defaultValue:''
            },
            email:{
                type:DataTypes.STRING(128),
                allowNull:true,
                unique:true
            },
            senha:{
                type:DataTypes.STRING(128),
                allowNull:false,
                validate:{
                    notEmpty:true
                }
            },
            sexo:{
                type:DataTypes.STRING(1),
                allowNull:true
            },
            pontuacao:{
                type:DataTypes.INTEGER,
                allowNull:true,
                defaultValue:0
            },
            cpf:{
                type:DataTypes.STRING(14),
                allowNull:true
            },
            fotoUsuario:{
                type:DataTypes.BLOB({
                    length:'long'
                }),
                allowNull:true,
                defaultValue:null
            },
            tipoLogin:{
                type:DataTypes.INTEGER,
                allowNull:true
            },
            dataNasc:{
                type:DataTypes.DATE,
                allowNull:true,
                defaultValue:null
            },
            idEmpresa:{
                type:DataTypes.INTEGER,
                allowNull:true
            },
            cargo:{
                type:DataTypes.STRING(128),
                allowNull:true
            },

        },{
            tableName:"usuario",
            hooks:{
                beforeCreate:(usuario:UsuarioInstance,options:Sequelize.CreateOptions): void => {
                    const salt  = genSaltSync();
                    usuario.senha = hashSync(usuario.senha, salt);
                },
                beforeUpdate:(usuario:UsuarioInstance,options:Sequelize.CreateOptions): void => {
                    if (usuario.changed('senha')){
                        const salt  = genSaltSync();
                        usuario.senha = hashSync(usuario.senha, salt);
                    }
                }
            }
        });

        Usuario.associate = (models:ModelsInterface):void => {
            Usuario.belongsTo(models.Empresa,{
                foreignKey: {
                    allowNull:false,
                    field:'idEmpresa',
                    name:'idEmpresa'
                }
            });
        };

        Usuario.prototype.isPassword = (encodedPassword: string, password:string):boolean =>{
            return compareSync(password, encodedPassword);
        }

        return Usuario;
}