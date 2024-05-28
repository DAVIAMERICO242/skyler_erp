import dotenv from 'dotenv';
dotenv.config();
import express, {Express} from 'express';
import { AuthMiddleware } from './sistema/authentication/allowAPIAccess';
import { ProtectFrontendRoutes_router} from './sistema/authentication/protectFrontendRoutes';
import {login_router} from  './sistema/authentication/login';
import cors from 'cors';
import FRONTEND_URL from './sistema/frontend-urls';
import { terceiros_major_router } from './sistema/entities/terceiros/majorRoute';
import { lojas_major_router } from './sistema/entities/lojas/majorRoute';
import { bancos_major_router } from './sistema/entities/bancos/majorRoute';

console.log(FRONTEND_URL);
const server:Express = express();

server.use(cors({
    origin:FRONTEND_URL,
}))
server.use(express.json());
server.use('/',ProtectFrontendRoutes_router);
server.use('/',login_router);
server.use('/',terceiros_major_router);
server.use('/',lojas_major_router);
server.use('/',bancos_major_router);


server.listen(process.env.BACKEND_PORT,()=>{
    console.log(`Express server listening on port ${process.env.BACKEND_PORT}`)
});


