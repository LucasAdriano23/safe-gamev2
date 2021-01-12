import { BaseModelInterface } from './../interfaces/BaseModelInterface';
import * as Sequelize  from "sequelize";
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface RespostaUsuarioAttributes {
    id?:number;
    idCarta:number;
    idUsuario:number;
    idAlternativaMarcada:number;
}

export interface RespostaUsuarioInstance extends Sequelize.Instance<RespostaUsuarioAttributes>{

}  

export interface RespostaUsuarioModel extends BaseModelInterface, Sequelize.Model<RespostaUsuarioInstance, RespostaUsuarioAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): RespostaUsuarioModel => {
    const RespostaUsuario: RespostaUsuarioModel = sequelize.define('RespostaUsuario',{
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        idCarta:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        idUsuario:{
            type:DataTypes.INTEGER,
            allowNull:false
        },

        idAlternativaMarcada:{
            type:DataTypes.INTEGER,
            allowNull:true
        },

    },{
        tableName:'respostausuario'
    });

    RespostaUsuario.associate = (models:ModelsInterface):void => {
        RespostaUsuario.belongsTo(models.Carta,{
            foreignKey: {
                allowNull:false,
                field:'idCarta',
                name:'idCarta'
            }
        });
    };

    RespostaUsuario.associate = (models:ModelsInterface):void => {
        RespostaUsuario.belongsTo(models.Usuario,{
            foreignKey: {
                allowNull:false,
                field:'idUsuario',
                name:'idUsuario'
            }
        });
    };

    return RespostaUsuario;
}