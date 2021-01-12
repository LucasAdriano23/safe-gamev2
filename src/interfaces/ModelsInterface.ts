import { RespostaUsuarioModel } from './../models/RespostaUsuarioModel';
import { CartaModel } from './../models/CartaModel';
import { PremiosModel } from './../models/PremiosModel';
import { EmpresaModel } from './../models/EmpresaModel';
import { UsuarioModel } from './../models/UsuarioModel';
import { AlternativaModel } from '../models/AlternativaModel';

export interface ModelsInterface {

    Usuario:UsuarioModel;
    Empresa:EmpresaModel;
    Premios:PremiosModel;
    Carta:CartaModel;
    Alternativa:AlternativaModel;
    RespostaUsuario:RespostaUsuarioModel;
}