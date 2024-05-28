import {Router} from 'express';
import { lojas_router } from './api/lojasAPI';

export const lojas_major_router = Router();

lojas_major_router.use('/lojas',lojas_router);

