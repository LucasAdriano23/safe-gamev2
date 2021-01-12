import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface PremiosAttributes {
    id?:number;
    idEmpresa?:number;
    imgPremio?:string;
    descPremio?:string;
}

export interface PremiosInstance extends Sequelize.Instance<PremiosAttributes>{

}  

export interface PremiosModel extends BaseModelInterface, Sequelize.Model<PremiosInstance, PremiosAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PremiosModel => {
    const Premios: PremiosModel = sequelize.define('Premios',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        imgPremio:{
            type:DataTypes.BLOB({
                length:'long'
            }),
            allowNull:true,
            defaultValue:null
        },
        descPremio:{
            type:DataTypes.TEXT,
            allowNull:true
        }
    },{
        tableName:'premios'
    });

    Premios.associate = (models:ModelsInterface):void => {
        Premios.belongsTo(models.Empresa,{
            foreignKey: {
                allowNull:false,
                field:'idEmpresa',
                name:'idEmpresa'
            }
        });
    };

    return Premios;
}