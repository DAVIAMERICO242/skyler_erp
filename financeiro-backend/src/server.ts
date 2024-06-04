import dotenv from 'dotenv';
dotenv.config();
import express, {Express} from 'express';
import { AuthMiddleware } from './sistema/authentication/allowAPIAccess';
import { ProtectFrontendRoutes_router} from './sistema/authentication/protectFrontendRoutes';
import {login_router} from  './sistema/authentication/login';
import cors from 'cors';
import FRONTEND_URL from './sistema/frontend-urls';
import { terceiros_major_router } from './sistema/entities/terceiros/terceirosRoute';
import { lojas_major_router } from './sistema/entities/lojas/lojasRoute';
import { bancos_major_router } from './sistema/entities/bancos/bancosRoute';
import { fiscal_category_major_router } from './sistema/fiscal_category/fiscalCategoryRouter';
import { contas_major_router } from './sistema/entities/contas/bancosRoute';

console.log(FRONTEND_URL);
const server:Express = express();

server.use(cors({
    origin:FRONTEND_URL,
}));

server.use(express.json());
server.use('/',ProtectFrontendRoutes_router);
server.use('/',login_router);
server.use('/',AuthMiddleware, terceiros_major_router);
server.use('/',AuthMiddleware, lojas_major_router);
server.use('/',AuthMiddleware, bancos_major_router);
server.use('/',AuthMiddleware, fiscal_category_major_router);
server.use('/',AuthMiddleware,contas_major_router)


server.listen(process.env.BACKEND_PORT,()=>{
    console.log(`Express server listening on port ${process.env.BACKEND_PORT}`)
});

