import { usuarioMutations } from "./resources/usuario/usuario.schema";
import { empresaMutations } from "./resources/empresa/empresa.schema";
import { premiosMutations } from "./resources/premios/premios.schema";
import { tokenMutations } from "./resources/token/token.schema";
import { cartaMutations } from "./resources/carta/carta.schema";
import { alternativaMutations } from "./resources/alternativa/alternativa.schema";
import { respostaUsuarioMutations } from "./resources/respostaUsuario/respostaUsuario.schema";

const Mutation = `
    type Mutation {
        ${respostaUsuarioMutations}
        ${alternativaMutations}
        ${cartaMutations}
        ${premiosMutations}
        ${empresaMutations}
        ${tokenMutations}
        ${usuarioMutations}
    }
`;

export {
    Mutation
}