import {Router} from 'express';
import { terceiros_router } from './api/terceirosAPI';

export const terceiros_major_router = Router();

terceiros_major_router.use('/terceiros',terceiros_router);

