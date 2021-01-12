import { usuarioQueries } from "./resources/usuario/usuario.schema";
import { empresaQueries } from "./resources/empresa/empresa.schema";
import { premiosQueries } from "./resources/premios/premios.schema";
import { cartaQueries } from "./resources/carta/carta.schema";
import { alternativaQueries } from "./resources/alternativa/alternativa.schema";
import { respostaUsuarioQueries } from "./resources/respostaUsuario/respostaUsuario.schema";

const Query = `
    type Query {
        ${respostaUsuarioQueries}
        ${alternativaQueries}
        ${cartaQueries}
        ${premiosQueries}
        ${empresaQueries}
        ${usuarioQueries}
    }
`;

export {
    Query
}