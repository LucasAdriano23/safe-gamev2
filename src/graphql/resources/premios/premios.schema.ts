const premiosTypes = `
type Premios {
    id:ID!
    idEmpresa: Empresa!
    imgPremio:String
    descPremio:String
    createdAt:String!
    updatedAt:String!
}

input PremiosInput {
    idEmpresa: Int!
    imgPremio:String
    descPremio:String
}
`;

const premiosQueries = `
    listarPremios(first:Int, offset: Int): [ Premios! ]!
`;


const premiosMutations = `
    adicionarPremio(input: PremiosInput): Premios
    editarPremio(id:ID!,input:PremiosInput): Premios
    excluirPremio(id:ID!):Boolean
`;

export {
    premiosTypes,
    premiosQueries,
    premiosMutations
}