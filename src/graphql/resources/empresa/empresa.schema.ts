const empresaTypes = `
    type Empresa {
        id:ID!
        nomeEmpresa:String!
        cnpj:String
        ramo:String!
        emailEmpresa:String
        usuarios(first:Int, offset: Int): [ Usuario ]
        usuariosByRank(first:Int, offset: Int): [ Usuario ]
        premios(first:Int, offset: Int): [ Premios ]
        createdAt:String!
        updatedAt:String!
    }

    input EmpresaInput {
        nomeEmpresa:String!
        cnpj:String
        ramo:String!
        emailEmpresa:String
    }
`;

const empresaQueries = `
    listarEmpresas(first:Int, offset: Int): [ Empresa! ]!    
    listarEmpresa(id:ID!): Empresa
`;

const empresaMutations = `
    adicionarEmpresa(input:EmpresaInput!): Empresa
    editarEmpresa(id:ID!,input:EmpresaInput!): Empresa
    excluirEmpresa(id:ID!):Boolean
`;

export {
    empresaTypes,
    empresaQueries,
    empresaMutations
}