import {Router} from 'express';
import { contas_router } from './api/contasAPI';

export const contas_major_router = Router();

contas_major_router.use('/contas',contas_router);
