import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface CartaAttributes {
    id?:number;
    questao?:string;
    idAlternativaCerta:number;
    tipoCarta:string;
    dificuldade:string;
    dataCarta:string;
}

export interface CartaInstance extends Sequelize.Instance<CartaAttributes>{

}  

export interface CartaModel extends BaseModelInterface, Sequelize.Model<CartaInstance, CartaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): CartaModel => {
    const Carta: CartaModel = sequelize.define('Carta',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        questao:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        idAlternativaCerta:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        tipoCarta:{
            type:DataTypes.STRING(128),
            allowNull:true
        },
        dificuldade:{
            type:DataTypes.STRING(128),
            allowNull:true
        },
        dataCarta:{
            type:DataTypes.DATE,
            allowNull:true
        }
    },{
        tableName:'carta'
    });

    return Carta;
}