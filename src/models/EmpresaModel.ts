import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface EmpresaAttributes {
    id?:number;
    nomeEmpresa?:string;
    ramo?:string;
    idUsuario?:number;
    emailEmpresa?:string;
    cnpj?:string;
    dataCadastro?:string;
}

export interface EmpresaInstance extends Sequelize.Instance<EmpresaAttributes>{

}  

export interface EmpresaModel extends BaseModelInterface, Sequelize.Model<EmpresaInstance, EmpresaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): EmpresaModel => {
    const Empresa: EmpresaModel = sequelize.define('Empresa',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        nomeEmpresa:{
            type:DataTypes.STRING,
            allowNull:false
        },
        ramo:{
            type:DataTypes.STRING,
            allowNull:true
        },
        emailEmpresa:{
            type:DataTypes.STRING(128),
            allowNull:true,
            unique:true
        },
        cnpj:{
            type:DataTypes.STRING(18),
            allowNull:true,
        }
    },{
        tableName:'empresa'
    });

    return Empresa;
}