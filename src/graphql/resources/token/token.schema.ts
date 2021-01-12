const tokenTypes = `
    type Token {
        token: String!
    }
`;

const tokenMutations = `
    createToken(cpf:String!, senha:String!): Token
`;

export {
    tokenTypes,
    tokenMutations
}