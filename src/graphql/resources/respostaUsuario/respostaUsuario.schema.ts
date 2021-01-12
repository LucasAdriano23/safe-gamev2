const respostaUsuarioTypes = `
type respostaUsuario {
    id:ID!
    idUsuario: Usuario!
    idCarta: Carta!
    idAlternativaMarcada: Int
    createdAt:String!
    updatedAt:String!
}

input respostaUsuarioInput {
    idUsuario: Int
    idCarta: Int
    idAlternativaMarcada: Int
}
`;

const respostaUsuarioQueries = `
    listarRespostasUsuarios(first:Int, offset: Int): [ respostaUsuario! ]!
    listarRespostaUsuario(id:ID!): respostaUsuario
`;


const respostaUsuarioMutations = `
    adicionarRespostaUsuario(input: respostaUsuarioInput): respostaUsuario
    editarRespostaUsuario(id:ID!,input:respostaUsuarioInput): respostaUsuario
    excluirRespostaUsuario(id:ID!):Boolean
`;

export {
    respostaUsuarioTypes,
    respostaUsuarioQueries,
    respostaUsuarioMutations
}