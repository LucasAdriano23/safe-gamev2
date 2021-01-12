import { alternativaResolvers } from './resources/alternativa/alternativa.resolvers';
import { cartaResolvers } from './resources/carta/carta.resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from "lodash";

import { Query } from "./query";
import { Mutation } from "./mutation";

//Types
import { usuarioTypes } from "./resources/usuario/usuario.schema";
import { empresaTypes } from "./resources/empresa/empresa.schema";
import { premiosTypes } from "./resources/premios/premios.schema";
import { tokenTypes } from './resources/token/token.schema';

//Resolvers
import { usuarioResolvers } from "./resources/usuario/usuario.resolvers";
import { empresaResolvers } from "./resources/empresa/empresa.resolvers";
import { tokenResolvers } from './resources/token/token.resolvers';
import { premiosResolvers } from './resources/premios/premios.resolvers';
import { cartaTypes } from './resources/carta/carta.schema';
import { alternativaTypes } from './resources/alternativa/alternativa.schema';
import { respostaUsuarioResolvers } from './resources/respostaUsuario/respostaUsuario.resolvers';
import { respostaUsuarioTypes } from './resources/respostaUsuario/respostaUsuario.schema';

const resolvers = merge(
    tokenResolvers,
    usuarioResolvers,
    empresaResolvers,
    premiosResolvers,
    cartaResolvers,
    alternativaResolvers,
    respostaUsuarioResolvers
);

const SchemaDefinition = `
type Schema {
    query:Query
    mutation: Mutation
}`;

export default makeExecutableSchema({
    typeDefs:[
        SchemaDefinition,
        Query,
        Mutation,
        empresaTypes,
        tokenTypes,
        usuarioTypes,
        premiosTypes,
        cartaTypes,
        alternativaTypes,
        respostaUsuarioTypes
    ],
    resolvers
});