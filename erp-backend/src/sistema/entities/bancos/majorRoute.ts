import {Router} from 'express';
import { bancos_router } from './api/main';

export const bancos_major_router = Router();

bancos_major_router.use('/bancos',bancos_router);
