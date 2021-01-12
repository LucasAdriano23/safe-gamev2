import { extractJwtMiddleware } from './middlewares/extract-jwt.middleware';
import * as express from "express";
import * as graphqlHTTP  from "express-graphql";
import schema from "./graphql/schema";
import  db  from "./models/Connection";
import * as cors from "cors";
import * as compression from "compression";
import * as helmet from "helmet";

class App {
    public express: express.Application;

    constructor(){
        this.express = express();
        this.middleware();
    }

    private middleware():void{

        this.express.use(cors({
            origin:'*',
            methods:['GET','POST'],
            allowedHeaders:['Content-Type','Authorization','Accept-Enconding'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        }));

        this.express.use(compression());
        this.express.use(helmet());

        this.express.use('/graphql',

        extractJwtMiddleware(),
        
            (req,res,next) => {
                req['context'].db = db;
                next();
            },
            graphqlHTTP((req) => ({
                schema:schema,
                graphiql: process.env.NODE_ENV.trim() === 'development',
                context:req['context']
            }))
        );
    }
}

export default new App().express;