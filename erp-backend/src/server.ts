import express, {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { AuthMiddleware } from './sistema/authentication/allowAPIAccess';
import { ProtectFrontendRoutes_router} from './sistema/authentication/protectFrontendRoutes';
import {login_router} from  './sistema/authentication/login';
import cors from 'cors';

const server:Express = express();

server.use(cors({
    origin:'http://localhost:5173',
}))
server.use(express.json());
server.use('/',ProtectFrontendRoutes_router);
server.use('/',login_router);

server.listen(process.env.BACKEND_PORT,()=>{
    console.log(`Express server listening on port ${process.env.BACKEND_PORT}`)
});


