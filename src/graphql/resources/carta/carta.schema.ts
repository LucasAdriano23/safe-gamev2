const cartaTypes = `
type Carta {
    id:ID!
    questao:String
    idAlternativaCerta:Int
    tipoCarta:String
    dificuldade:String
    createdAt:String!
    updatedAt:String!
    idsAlternativas(first:Int, offset: Int): [ Alternativa ]
}

input cartaInput {
    questao:String
    idAlternativaCerta:Int
    tipoCarta:String
    dificuldade:String
}
`;

const cartaQueries = `
    listarCartas(first:Int, offset: Int): [ Carta! ]!
    listarCarta(id:ID!): Carta
`;


const cartaMutations = `
    adicionarCarta(input: cartaInput): Carta
    editarCarta(id:ID!,input:cartaInput): Carta
    excluirCarta(id:ID!):Boolean
`;

export {
    cartaTypes,
    cartaQueries,
    cartaMutations
}