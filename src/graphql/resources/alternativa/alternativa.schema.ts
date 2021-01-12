const alternativaTypes = `
type Alternativa {
    id:ID!
    alternativa:String!
    idCarta: Carta
    createdAt:String!
    updatedAt:String!
}

input alternativaInput {
    alternativa:String
    idCarta:Int
}
`;

const alternativaQueries = `
    listarAlternativas(first:Int, offset: Int): [ Alternativa! ]!
    listarAlternativa(id:ID!):  Alternativa
`;


const alternativaMutations = `
    adicionarAlternativa(input:alternativaInput): Alternativa
    editarAlternativa(id:ID!,input:alternativaInput): Alternativa
    excluirAlternativa(id:ID!):Boolean
`;

export {
    alternativaTypes,
    alternativaQueries,
    alternativaMutations
}