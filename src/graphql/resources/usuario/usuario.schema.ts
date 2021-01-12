const usuarioTypes = `

    type Usuario {
        id:ID!
        nomeUsuario: String!
        nome:String
        sobrenome:String
        email: String!
        sexo:String
        pontuacao:Int
        createdAt:String!
        updatedAt:String!
        dataNasc:String
        cpf:String
        fotoUsuario:String
        tipoLogin:Int
        idEmpresa: Empresa
        cargo:String
    }

    input UsuarioCreateInput {
        nomeUsuario: String!
        nome:String
        sobrenome:String
        email: String
        sexo: String
        pontuacao:Int
        pontuacaoExtra:Int
        dataNasc: String
        cpf: String!
        fotoUsuario: String
        tipoLogin:Int
        senha:String!
        idEmpresa: Int
        cargo:String
    }

    input UsuarioUpdateInput {
        nomeUsuario: String
        nome:String
        sobrenome:String
        email: String
        fotoUsuario:String
        dataNasc:String
        pontuacao:Int
        pontuacaoExtra:Int
        cpf: String
        idEmpresa:Int
        cargo:String
    }

    input UsuarioUpdateSenhaInput {
        senha:String!
    }

    input adicionarPontuacaoExtra {
        pontuacaoExtra:Int!
    }

    input adicionarPontuacao {
        pontuacao:Int!
    }
`;

const usuarioQueries = `
    listarUsuarios(first:Int, offset: Int): [ Usuario! ]!
    listarUsuario(id:ID!): Usuario
    rankUsuarios(first:Int, offset: Int): [ Usuario! ]!
    rankUsuario(id:ID!): Usuario
    currentUser:Usuario
`;

const usuarioMutations = `
    adicionarUsuario(input: UsuarioCreateInput!): Usuario
    editarUsuario(id:ID!,input:UsuarioUpdateInput!): Usuario
    editarSenhaUsuario(input: UsuarioUpdateSenhaInput):Boolean
    excluirUsuario(id:ID!): Boolean
    adicionarPontExtra(input:adicionarPontuacaoExtra ): Usuario
    rodarDadoMagico(input:adicionarPontuacao): Usuario
`;

export {
    usuarioTypes,
    usuarioQueries,
    usuarioMutations
}