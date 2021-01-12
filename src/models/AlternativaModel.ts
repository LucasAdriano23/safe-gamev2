import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface AlternativaAttributes {
    id?:number;
    idCarta:number;
    alternativa:string;
}

export interface AlternativaInstance extends Sequelize.Instance<AlternativaAttributes>{

}  

export interface AlternativaModel extends BaseModelInterface, Sequelize.Model<AlternativaInstance, AlternativaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): AlternativaModel => {
    const Alternativa: AlternativaModel = sequelize.define('Alternativa',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        alternativa:{
            type:DataTypes.STRING,
            allowNull:true
        }

    },{
        tableName:'alternativa'
    });

    Alternativa.associate = (models:ModelsInterface):void => {
        Alternativa.belongsTo(models.Carta,{
            foreignKey: {
                allowNull:false,
                field:'idCarta',
                name:'idCarta'
            }
        });
    };

    return Alternativa;
}